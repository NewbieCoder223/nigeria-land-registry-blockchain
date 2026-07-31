import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))


class Config:
    SECRET_KEY      = os.environ.get('SECRET_KEY', '')
    # Supabase Config
    SUPABASE_URL              = os.environ.get('SUPABASE_URL', '')
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', os.environ.get('SUPABASE_KEY', ''))

    # Blockchain Config
    RPC_URL          = os.environ.get('POLYGON_AMOY_RPC_URL') or os.environ.get('POLYGON_AMOY_RPC_UR') or 'https://polygon-amoy.drpc.org'
    CONTRACT_ADDRESS = os.environ.get('LAND_REGISTRY_ADDRESS', '0xd5588e12b24c74Cd35Eab58609C3C9B66762797a')

    # Pinata IPFS Config
    PINATA_API_KEY    = os.environ.get('PINATA_API_KEY', '')
    PINATA_API_SECRET = os.environ.get('PINATA_API_SECRET', '')
    PINATA_JWT        = os.environ.get('PINATA_JWT', '')

    # NIN Provider: 'mock' (default) or 'nimc' (production)
    NIN_PROVIDER = os.environ.get('NIN_PROVIDER', 'mock')
