import os
import sys

# Set dummy env vars for Supabase to avoid initialization error during tests
os.environ['SUPABASE_URL'] = "https://example.supabase.co"
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = "dummy_key"

# To run: pytest test_RBAC_escalation.py
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import requests
import json
from unittest.mock import patch, MagicMock

# We'll just test the Flask app directly
from app import app, supabase
import pytest

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_rbac_escalation_vulnerability(client):
    """
    Test that the backend accepts any role specified by the user during registration.
    """
    # Mocking supabase client
    with patch('app.supabase.auth.sign_up') as mock_signup, \
         patch('app.supabase.table') as mock_table, \
         patch('app.get_nin_provider') as mock_nin:
        
        # Mock successful NIN
        mock_provider = MagicMock()
        mock_provider.verify.return_value.is_verified = True
        mock_provider.verify.return_value.nin_hash = "mock_hash"
        mock_nin.return_value = mock_provider
        
        # Mock auth
        mock_signup.return_value.user.id = "hacked-uuid"
        
        # Mock table insert
        mock_insert = MagicMock()
        mock_table.return_value.insert.return_value = mock_insert
        mock_insert.execute.return_value = True

        data = {
            "wallet_address": "0xAttacker",
            "name": "Attacker",
            "email": "attacker@hack.com",
            "role": "GOVERNOR",  # <---- THE VULNERABLE PAYLOAD
            "nin": "12345678901",
            "dob": "1990-01-01",
            "password": "Password123!"
        }
        
        res = client.post('/api/auth/register', json=data)
        
        assert res.status_code == 201
        
        # Check what the backend tried to insert
        mock_table.assert_called_with("profiles")
        inserted_data = mock_table.return_value.insert.call_args[0][0]
        
        assert inserted_data['role'] == 'LAND_OWNER'
        print("\n[+] VULNERABILITY MITIGATED: Malicious GOVERNOR payload ignored. User inserted as LAND_OWNER.\n")

if __name__ == '__main__':
    pytest.main(["-v", "test_RBAC_escalation.py"])
