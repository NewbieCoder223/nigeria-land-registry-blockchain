import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env from root
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set")

supabase: Client = create_client(url, key)

def get_supabase_client() -> Client:
    """Returns an authenticated Supabase client for backend operations."""
    return supabase
