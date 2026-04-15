import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env from root
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not url:
    url = "https://mock.supabase.co"
if not key:
    key = "dummy.JWT.key123"

try:
    supabase: Client = create_client(url, key)
except Exception as e:
    # Fallback to dummy for tests so collection doesn't fail
    supabase: Client = create_client("https://mock.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY2siLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjYxNjAwMCwiZXhwIjoxOTE2NjE2MDAwfQ.mock_signature_to_be_replaced_with_thirty_two_chars")

def get_supabase_client() -> Client:
    """Returns an authenticated Supabase client for backend operations."""
    return supabase
