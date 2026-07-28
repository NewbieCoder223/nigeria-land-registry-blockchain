import os
import sys
import pytest
import uuid
import json
from unittest.mock import patch, MagicMock

# Set dummy env vars for Supabase to avoid initialization error during tests
os.environ['SUPABASE_URL'] = "https://example.supabase.co"
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.signature"

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('app.supabase')
def test_health_check(mock_supabase, client):
    """Verify system health status reporting."""
    # Mock successful supabase query
    mock_supabase.table.return_value.select.return_value.limit.return_value.execute.return_value = MagicMock()
    
    rv = client.get('/health')
    json_data = rv.get_json()
    assert rv.status_code == 200
    assert json_data['database_connected'] is True

@patch('app.supabase')
@patch('app.get_nin_provider')
def test_user_registration_flow(mock_get_nin, mock_supabase, client):
    """Test full registration with identity verification."""
    payload = {
        "wallet_address": f"0x{uuid.uuid4().hex[:40]}",
        "name": "Aliko Dangote",
        "email": f"aliko_{uuid.uuid4().hex[:8]}@example.com",
        "role": "LAND_OWNER",
        "nin": "12345678901",
        "dob": "1957-04-10",
        "password": "SecurePassword123"
    }

    # Mock identity success
    mock_provider = MagicMock()
    mock_result = MagicMock()
    mock_result.is_verified = True
    mock_result.nin_hash = "fake_hash"
    mock_provider.verify.return_value = mock_result
    mock_get_nin.return_value = mock_provider

    # Mock supabase auth success
    mock_auth_res = MagicMock()
    mock_auth_res.user.id = "user_uuid"
    mock_supabase.auth.sign_up.return_value = mock_auth_res
    
    rv = client.post('/api/auth/register', json=payload)
    assert rv.status_code == 201
    assert rv.get_json()['user_id'] == "user_uuid"

@patch('app.supabase')
def test_parcel_indexing(mock_supabase, client):
    """Verify off-chain data retrieval from search index."""
    # Mock Auth
    mock_supabase.auth.get_user.return_value = MagicMock(user=MagicMock(id="user_uuid"))
    # Mock Role
    mock_profile = MagicMock()
    mock_profile.data = {"role": "LAND_OWNER"}
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_profile

    # Mock parcel fetch
    mock_parcel_res = MagicMock()
    mock_parcel_res.data = {"parcel_id": 1, "state": "Lagos", "lga": "Ikeja"}
    
    # Let's just patch the DB call returning the parcel
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_parcel_res

    headers = {'Authorization': 'Bearer FAKE_TOKEN'}
    rv = client.get('/api/parcels/1', headers=headers)
    assert rv.status_code == 200
    assert "parcel_id" in rv.get_json()
