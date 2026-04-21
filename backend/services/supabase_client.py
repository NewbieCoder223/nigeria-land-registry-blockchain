import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env from root
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided via environment variables.")

try:
    supabase: Client = create_client(url, key)
except Exception as e:
    raise ValueError(f"Failed to initialize Supabase client. Error: {e}")

def get_supabase_client() -> Client:
    """Returns an authenticated Supabase client for backend operations."""
    return supabase
