import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env from root
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

url: str = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or ""
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_KEY") or ""

if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set")

try:
    supabase: Client = create_client(url, key)
except Exception as e:
    print(f"Error initializing Supabase client: {e}")
    supabase = None

def get_supabase_client() -> Client:
    """Returns an authenticated Supabase client for backend operations."""
    return supabase
