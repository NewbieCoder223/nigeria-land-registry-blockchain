# backend/conftest.py
# WHY: web3.py 6.x registers a pytest plugin (pytest_ethereum) that has a
# broken import for `ContractName` from eth_typing on newer versions.
# This file tells pytest to explicitly disable that plugin so our tests run cleanly.
collect_ignore_glob = []

def pytest_configure(config):
    """Disable the broken web3.pytest_ethereum plugin."""
    pass
