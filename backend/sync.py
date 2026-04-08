import os
import sys
import time
import json
import enum
from web3 import Web3

try:
    from config import Config
    from services.supabase_client import get_supabase_client
except ImportError:
    from backend.config import Config
    from backend.services.supabase_client import get_supabase_client

class ParcelStatus(enum.Enum):
    Active   = 0
    Frozen   = 1
    Disputed = 2

def load_abi():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    abi_path = os.path.join(script_dir, '..', 'contracts', 'artifacts', 'contracts', 'LandRegistry.sol', 'LandRegistry.json')
    with open(abi_path, 'r') as f:
        return json.load(f)['abi']

w3 = Web3(Web3.HTTPProvider(Config.RPC_URL or ""))
abi = load_abi()
contract = w3.eth.contract(address=Config.CONTRACT_ADDRESS, abi=abi)
supabase = get_supabase_client()

def handle_land_registered(event):
    args = event['args']
    data = {
        "parcel_id": args['parcelId'],
        "gps_coordinates": args['gps'], 
        "area": args['area'],
        "ipfs_hash": args['ipfsHash'],
        "owner_address": args['owner'],
        "status": "Active"
    }
    try:
        supabase.table("parcels").upsert(data).execute()
        print(f"[Sync] LandRegistered — ID: {args['parcelId']}, Owner: {args['owner']}")
    except Exception as e:
        print(f"[Sync] Error indexing LandRegistered: {e}")

def handle_transfer_initiated(event):
    args = event['args']
    # 1. Update parcel status
    supabase.table("parcels").update({"status": "Initiated"}).eq("parcel_id", args['parcelId']).execute()
    
    # 2. Upsert transfer request
    transfer_data = {
        "parcel_id": args['parcelId'],
        "from_address": args['from'],
        "to_address": args['to'],
        "status": "Initiated",
        "surveyor_approved": False,
        "verifier_approved": False,
        "registrar_approved": False
    }
    # We use a unique constraint on (parcel_id, from, to, status='Initiated') if needed, 
    # but for prototype, simple insert/upsert is fine.
    supabase.table("transfers").upsert(transfer_data, on_conflict="parcel_id").execute()
    print(f"[Sync] TransferInitiated — ID: {args['parcelId']}, To: {args['to']}")

def handle_transfer_approved(event):
    args = event['args']
    role_hash = args['role'].hex()
    
    update_data = {}
    new_status = ""
    
    if "b30" in role_hash: # SURVEYOR_ROLE
        update_data = {"surveyor_approved": True, "status": "SurveyorVerified"}
        new_status = "SurveyorVerified"
    elif "791" in role_hash: # VERIFIER_ROLE
        update_data = {"verifier_approved": True, "status": "LegallyValidated"}
        new_status = "LegallyValidated"
    elif "264" in role_hash: # REGISTRAR_ROLE
        update_data = {"registrar_approved": True, "status": "RegistrarApproved"}
        new_status = "RegistrarApproved"

    if update_data:
        supabase.table("transfers").update(update_data).eq("parcel_id", args['parcelId']).execute()
        supabase.table("parcels").update({"status": new_status}).eq("parcel_id", args['parcelId']).execute()
        print(f"[Sync] TransferApproved — ID: {args['parcelId']}, Status: {new_status}")

def handle_transfer_completed(event):
    args = event['args']
    # 1. Update parcel ownership and reset status
    supabase.table("parcels").update({
        "owner_address": args['to'],
        "status": "Active"
    }).eq("parcel_id", args['parcelId']).execute()
    
    # 2. Mark transfer as completed
    supabase.table("transfers").update({"status": "Completed"}).eq("parcel_id", args['parcelId']).execute()
    print(f"[Sync] TransferCompleted — ID: {args['parcelId']}, New Owner: {args['to']}")

def handle_dispute_filed(event):
    args = event['args']
    supabase.table("parcels").update({"status": "Disputed"}).eq("parcel_id", args['parcelId']).execute()
    print(f"[Sync] DisputeFiled — ID: {args['parcelId']}")

def handle_dispute_resolved(event):
    args = event['args']
    # Status mapping from enum: Active=0, Frozen=1, Disputed=2
    status_map = {0: "Active", 1: "Frozen", 2: "Disputed"}
    new_status = status_map.get(args['resolvedStatus'], "Active")
    supabase.table("parcels").update({"status": new_status}).eq("parcel_id", args['parcelId']).execute()
    print(f"[Sync] DisputeResolved — ID: {args['parcelId']}, Status: {new_status}")

def log_loop(poll_interval: int = 2):
    print("[Sync] Starting Sovereign Indexer — Full Lifecycle Mode...")
    if not w3.is_connected():
        print("[Sync] ERROR: No RPC connection")
        return

    # Using manual block polling to avoid some filter limitations on certain nodes
    last_processed_block = w3.eth.block_number
    
    while True:
        try:
            current_block = w3.eth.block_number
            if current_block > last_processed_block:
                for block_num in range(last_processed_block + 1, current_block + 1):
                    # ADVERSARIAL FIX: Pull all events and process in true chronological sequence
                    all_logs = []
                    all_logs.extend(contract.events.LandRegistered().get_logs(fromBlock=block_num, toBlock=block_num))
                    all_logs.extend(contract.events.TransferInitiated().get_logs(fromBlock=block_num, toBlock=block_num))
                    all_logs.extend(contract.events.TransferApproved().get_logs(fromBlock=block_num, toBlock=block_num))
                    all_logs.extend(contract.events.TransferCompleted().get_logs(fromBlock=block_num, toBlock=block_num))
                    all_logs.extend(contract.events.DisputeFiled().get_logs(fromBlock=block_num, toBlock=block_num))
                    all_logs.extend(contract.events.DisputeResolved().get_logs(fromBlock=block_num, toBlock=block_num))

                    # Sort strictly by log transaction/index to prevent race conditions within the same block
                    all_logs.sort(key=lambda e: (e['blockNumber'], e['logIndex']))

                    for e in all_logs:
                        if e.event == 'LandRegistered': handle_land_registered(e)
                        elif e.event == 'TransferInitiated': handle_transfer_initiated(e)
                        elif e.event == 'TransferApproved': handle_transfer_approved(e)
                        elif e.event == 'TransferCompleted': handle_transfer_completed(e)
                        elif e.event == 'DisputeFiled': handle_dispute_filed(e)
                        elif e.event == 'DisputeResolved': handle_dispute_resolved(e)

                last_processed_block = current_block
        except Exception as e:
            print(f"[Sync] Error: {e}")
        time.sleep(poll_interval)

if __name__ == '__main__':
    log_loop(2)
