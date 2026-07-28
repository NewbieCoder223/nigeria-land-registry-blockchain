from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(42), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False) # LAND_OWNER, SURVEYOR, REGISTRAR, VERIFIER, GOVERNOR
    nin_hash = db.Column(db.String(64), nullable=True) # Hashed for privacy
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class LandParcelIndex(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parcel_id = db.Column(db.Integer, unique=True, nullable=False) # Blockchain ID
    state = db.Column(db.String(50), nullable=False)
    lga = db.Column(db.String(50), nullable=False)
    owner_address = db.Column(db.String(42), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    last_sync = db.Column(db.DateTime, default=datetime.utcnow)

class TransferHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parcel_id = db.Column(db.Integer, nullable=False)
    from_address = db.Column(db.String(42), nullable=False)
    to_address = db.Column(db.String(42), nullable=False)
    transaction_hash = db.Column(db.String(66), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
