"""
backend/services/nin_provider.py

Swappable Identity Verification Adapter (NIN — Nigeria Identity Number).

WHY THIS PATTERN EXISTS:
  Prompt 2 requires "Mock external APIs (NIN verification) using swappable adapters".
  Nigeria's National Identity Management Commission (NIMC) does not offer a public
  developer sandbox. By implementing an abstract base class (NINProviderBase) and a
  concrete MockNINProvider, we:
    1. Satisfy the academic specification for the MVP.
    2. Allow a future real provider (NIMCNINProvider) to be swapped in by changing
       ONE environment variable — zero changes to the application logic required.

USAGE:
  from backend.services.nin_provider import get_nin_provider
  provider = get_nin_provider()
  result = provider.verify(nin="12345678901", name="John Doe", dob="1990-01-01")
"""

import os
import hashlib
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class NINVerificationResult:
    """Structured result returned by any NIN provider."""
    is_verified: bool
    nin_hash: Optional[str]  # SHA-256 hash stored for NDPA compliance (never the raw NIN)
    message: str


class NINProviderBase(ABC):
    """
    Abstract base class for National Identity Number verification providers.
    Any concrete implementation MUST implement the `verify` method.
    """

    @abstractmethod
    def verify(self, nin: str, name: str, dob: str) -> NINVerificationResult:
        """
        Verify a citizen's NIN against their declared identity.

        Args:
            nin:  The 11-digit Nigeria National Identity Number.
            name: Full legal name as declared by the applicant.
            dob:  Date of birth in ISO 8601 format (YYYY-MM-DD).

        Returns:
            NINVerificationResult with is_verified, nin_hash, and message.
        """
        raise NotImplementedError


class MockNINProvider(NINProviderBase):
    """
    Mock NIN verification provider for development and testing.

    Simulation rules (deterministic, predictable for tests):
      - Any NIN with the format '00000000000' (all zeros) → REJECTED (invalid format)
      - NINs starting with '999' → REJECTED (simulates NIMC API rejection)
      - All other 11-digit NINs → VERIFIED

    WHY DETERMINISTIC: Randomness in a mock makes tests flaky. This mock is
    fully predictable so test assertions are reliable.
    """

    def verify(self, nin: str, name: str, dob: str) -> NINVerificationResult:
        # Validate format: must be exactly 11 digits
        if not nin or not nin.isdigit() or len(nin) != 11:
            return NINVerificationResult(
                is_verified=False,
                nin_hash=None,
                message="NIN must be exactly 11 numeric digits."
            )

        # Simulate rejection for known bad NINs
        if nin == "00000000000":
            return NINVerificationResult(
                is_verified=False,
                nin_hash=None,
                message="NIN not found in NIMC database (mock: zero NIN rejected)."
            )

        if nin.startswith("999"):
            return NINVerificationResult(
                is_verified=False,
                nin_hash=None,
                message="NIMC API returned error for this NIN (mock: 999 prefix rejected)."
            )

        # Hash the NIN for storage — never store raw NINs (NDPA compliance)
        nin_hash = hashlib.sha256(nin.encode()).hexdigest()

        return NINVerificationResult(
            is_verified=True,
            nin_hash=nin_hash,
            message=f"Identity verified successfully for {name} (mock provider)."
        )


class NIMCNINProvider(NINProviderBase):
    """
    Production NIMC (National Identity Management Commission) NIN provider.
    Connects to the official NIMC Identity Verification API.

    NOTE: This is a placeholder. The real NIMC API requires a government-issued
    API key and is not publicly available. This class documents the interface
    so that a future developer can implement it with zero changes to app.py.

    To activate: set NIN_PROVIDER=nimc in your .env file.
    """

    def __init__(self):
        self.api_key = os.environ.get("NIMC_API_KEY")
        self.base_url = os.environ.get("NIMC_API_URL", "https://api.nimc.gov.ng/v1")

    def verify(self, nin: str, name: str, dob: str) -> NINVerificationResult:
        # TODO: Uncomment and implement when official NIMC API access is granted.
        # import requests
        # response = requests.post(
        #     f"{self.base_url}/verify",
        #     json={"nin": nin, "name": name, "dob": dob},
        #     headers={"Authorization": f"Bearer {self.api_key}"},
        #     timeout=10
        # )
        # data = response.json()
        # ...
        raise NotImplementedError("NIMC production API is not yet configured.")


# ─── Factory Function ─────────────────────────────────────────────────────────

def get_nin_provider() -> NINProviderBase:
    """
    Factory function — returns the correct NIN provider based on the environment.

    Set NIN_PROVIDER=nimc in .env to use the production NIMC provider.
    Defaults to the MockNINProvider for all other values or if unset.
    """
    provider_name = os.environ.get("NIN_PROVIDER", "mock").lower()

    if provider_name == "nimc":
        return NIMCNINProvider()

    return MockNINProvider()
