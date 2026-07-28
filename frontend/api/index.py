"""
backend/app.py — Flask Application Entry Point

WHY THIS ARCHITECTURE:
  Flask is the ORCHESTRATOR in this hybrid GovTech system.
  It does NOT have authority over ownership — the smart contract does.
  Its roles:
    1. Identity & Access Management (JWT + RBAC)
    2. Off-chain indexing of blockchain events (via sync.py)
    3. IPFS document upload broker (Pinata)
    4. NIN verification gateway (swappable adapter)
"""

import os
import logging
import requests
from functools import wraps
from flask import Flask, jsonify, request
from flask_cors import CORS
from .config import Config
from .services.supabase_client import get_supabase_client
from .services.nin_provider import get_nin_provider
from web3 import Web3

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
supabase = get_supabase_client()

# --- Initialize Web3 ---
w3 = Web3(Web3.HTTPProvider(Config.RPC_URL or ""))

# --- Pinata Integration ---
PINATA_BASE_URL = "https://api.pinata.cloud"


def upload_to_ipfs(file_content, filename):
    """Upload a file to IPFS via the Pinata pinning service."""
    url = f"{PINATA_BASE_URL}/pinning/pinFileToIPFS"
    headers = {
        'pinata_api_key': Config.PINATA_API_KEY,
        'pinata_secret_api_key': Config.PINATA_API_SECRET
    }
    files = {'file': (filename, file_content)}
    try:
        response = requests.post(url, headers=headers, files=files, timeout=15)
        if response.status_code == 200:
            return response.json()['IpfsHash']
    except requests.RequestException:
        pass
    return None


# ─── RBAC & Auth Decorator ───────────────────────────────────────────────────

def require_auth(roles=None):
    """
    Decorator that verifies Supabase JWT and optionally checks for specific roles.
    Replaces Flask-JWT-Extended with Supabase native auth.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return jsonify({"message": "Missing Authorization header"}), 401
            
            token = auth_header.split(" ")[1] if " " in auth_header else auth_header
            try:
                # Verify token with Supabase
                res = supabase.auth.get_user(token)
                user = res.user
                if not user:
                    return jsonify({"message": "Invalid session"}), 401
                
                # Role check
                if roles:
                    profile = supabase.table("profiles").select("role").eq("id", user.id).single().execute()
                    # ADVERSARIAL FIX: Never trust user-provided roles.
                    # Enforce LAND_OWNER as the default role for all self-registered frontend users.
                    # Any other role (GOVERNOR, REGISTRAR, etc.) must be handled by an offline admin script or protected endpoint.
                    user_role = profile.data.get("role") if profile.data else 'LAND_OWNER'
                    if user_role not in roles:
                        return jsonify({"message": f"Access denied. Required roles: {roles}"}), 403
                
                # Attach user to request context
                request.user = user
                return fn(*args, **kwargs)
            except Exception as e:
                logging.exception("Auth verification failed")
                return jsonify({"message": "Authentication failed"}), 401
        return wrapper
    return decorator


# ─── Health Check ─────────────────────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health_check():
    """System health probe for load balancers and monitoring tools."""
    db_ok = False
    try:
        # Check supabase connection
        supabase.table("profiles").select("id").limit(1).execute()
        db_ok = True
    except Exception:
        pass

    return jsonify({
        "status": "healthy" if db_ok else "degraded",
        "blockchain_connected": w3.is_connected(),
        "database_connected": db_ok
    })


# ─── Authentication Routes ─────────────────────────────────────────────────────

@app.route('/api/auth/register', methods=['POST'])
def register_user():
    """
    Register a multi-sig identity.
    Uses Supabase Auth for the account and the public.profiles table for roles.
    """
    data = request.json
    required = ['wallet_address', 'name', 'email', 'nin', 'dob', 'password']
    if not all(k in data for k in required):
        return jsonify({"message": f"Missing fields: {required}"}), 400

    # ADVERSARIAL FIX: Force default LAND_OWNER role instead of trusting client input
    role = 'LAND_OWNER'

    # 1. Verification via Adapter
    nin_provider = get_nin_provider()
    nin_result = nin_provider.verify(nin=data['nin'], name=data['name'], dob=data['dob'])
    if not nin_result.is_verified:
        return jsonify({"message": "NIN verification failed", "detail": nin_result.message}), 422

    # 2. Supabase Auth Signup
    try:
        auth_res = supabase.auth.sign_up({
            "email": data['email'],
            "password": data['password'],
            "options": {"data": {"wallet_address": data['wallet_address'], "role": role}}
        })
        user = auth_res.user
        
        # 3. Create entry in public.profiles for RBAC
        supabase.table("profiles").insert({
            "id": user.id,
            "wallet_address": data['wallet_address'],
            "full_name": data['name'],
            "email": data['email'],
            "role": role,
            "nin_hash": nin_result.nin_hash,
            "is_verified": True
        }).execute()

        return jsonify({"message": "User created", "user_id": user.id}), 201
    except Exception as e:
        logging.exception("Registration failed")
        return jsonify({"message": "Registration failed. Please try again."}), 400

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    """Authenticate via Supabase."""
    data = request.json
    try:
        res = supabase.auth.sign_in_with_password({
            "email": data['email'],
            "password": data['password']
        })
        return jsonify({
            "token": res.session.access_token,
            "user": res.user
        }), 200
    except Exception as e:
        logging.exception("Login failed")
        return jsonify({"message": "Invalid email or password"}), 401


@app.route('/api/auth/verify-nin', methods=['POST'])
@require_auth()
def verify_nin():
    """
    Standalone NIN verification endpoint.
    Allows the frontend to verify identity before initiating registration.
    The actual NIN is never persisted — only its SHA-256 hash.
    """
    data = request.json
    if not all(k in data for k in ['nin', 'name', 'dob']):
        return jsonify({"message": "Fields required: nin, name, dob"}), 400

    nin_provider = get_nin_provider()
    result = nin_provider.verify(nin=data['nin'], name=data['name'], dob=data['dob'])

    if result.is_verified:
        return jsonify({
            "verified": True,
            "message": result.message,
            "nin_hash": result.nin_hash
        }), 200

    return jsonify({"verified": False, "message": result.message}), 422


# ─── Parcel Routes ─────────────────────────────────────────────────────────────

@app.route('/api/parcels', methods=['GET'])
@require_auth()
def get_parcels():
    """Fetch read-replica from Supabase."""
    res = supabase.table("parcels").select("*").execute()
    return jsonify(res.data)


@app.route('/api/parcels/<int:parcel_id>', methods=['GET'])
@require_auth()
def get_parcel(parcel_id):
    res = supabase.table("parcels").select("*").eq("parcel_id", parcel_id).single().execute()
    if not res.data:
        return jsonify({"message": "Parcel not found"}), 404
    return jsonify(res.data)


@app.route('/api/parcels/upload-deed', methods=['POST'])
@require_auth(roles=['REGISTRAR', 'LAND_OWNER'])
def upload_deed():
    """Upload to IPFS via Pinata broker."""
    if 'file' not in request.files:
        return jsonify({"message": "No file"}), 400
    file = request.files['file']
    ipfs_hash = upload_to_ipfs(file.read(), file.filename)
    if not ipfs_hash:
        return jsonify({"message": "IPFS failed"}), 500
    return jsonify({"ipfs_hash": ipfs_hash, "url": f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"}), 200


@app.route('/api/parcels/transfer-history/<int:parcel_id>', methods=['GET'])
@require_auth()
def get_transfer_history(parcel_id):
    """Returns the full on-chain transfer history for a parcel, synced from blockchain events."""
    res = supabase.table("transfers")\
        .select("*")\
        .eq("parcel_id", parcel_id)\
        .order("created_at", desc=True)\
        .execute()
    return jsonify(res.data)


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == '__main__':
    # Usage: python app.py
    app.run(debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true", port=int(os.environ.get("PORT", 5000)))
