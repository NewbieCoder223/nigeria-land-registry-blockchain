import os

# NOTE: load_dotenv is not needed on Vercel as variables are set in the Dashboard.
# During local development, Vercel CLI handles loading .env automatically.


class Config:
    SECRET_KEY      = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    # Supabase Config
    SUPABASE_URL              = os.environ.get('SUPABASE_URL') or os.environ.get('VITE_SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL') or ''
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_SECRET_KEY') or os.environ.get('SUPABASE_KEY') or ''

    # Blockchain Config
    RPC_URL          = os.environ.get('POLYGON_AMOY_RPC_URL') or os.environ.get('POLYGON_AMOY_RPC_UR') or ''
    CONTRACT_ADDRESS = os.environ.get('LAND_REGISTRY_ADDRESS', '')

    # Pinata IPFS Config
    PINATA_API_KEY    = os.environ.get('PINATA_API_KEY', '')
    PINATA_API_SECRET = os.environ.get('PINATA_API_SECRET', '')
    PINATA_JWT        = os.environ.get('PINATA_JWT', '')

    # NIN Provider: 'mock' (default) or 'nimc' (production)
    NIN_PROVIDER = os.environ.get('NIN_PROVIDER', 'mock')
