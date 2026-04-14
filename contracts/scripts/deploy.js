const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // OpenZeppelin v5 AccessControlDefaultAdminRules requires an initial delay for admin transfers.
  // 172800 seconds = 2 days delay for transferring the default admin role.
  const initialDelay = 172800; 
  
  // For production-grade simulation, we specify an admin and a governor.
  const adminAddress = deployer.address;
  const governorAddress = deployer.address; // Should be a separate, secure Multi-Sig in prod
  const registrarAddress = deployer.address;
  const surveyorAddress = deployer.address;
  const verifierAddress = deployer.address;

  console.log("Setting up LandRegistry with Admin:", adminAddress);
  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  
  // Deploying with constructor arguments (initialDelay, admin) + GAS OVERRIDES
  const landRegistry = await LandRegistry.deploy(initialDelay, adminAddress, {
    gasLimit: 3150000,
    maxFeePerGas: ethers.parseUnits('28', 'gwei'),
    maxPriorityFeePerGas: ethers.parseUnits('25.5', 'gwei')
  });
  
  await landRegistry.waitForDeployment();
  const contractAddress = await landRegistry.getAddress();
  console.log("LandRegistry deployed to:", contractAddress);

  // Grant INITIAL ROLES (Since admin is deployer right now, we can grant roles)
  console.log("Granting initial roles...");
  const REGISTRAR_ROLE = await landRegistry.REGISTRAR_ROLE();
  const SURVEYOR_ROLE = await landRegistry.SURVEYOR_ROLE();
  const VERIFIER_ROLE = await landRegistry.VERIFIER_ROLE();
  const GOVERNOR_ROLE = await landRegistry.GOVERNOR_ROLE();

  await landRegistry.grantRole(REGISTRAR_ROLE, registrarAddress);
  await landRegistry.grantRole(SURVEYOR_ROLE, surveyorAddress);
  await landRegistry.grantRole(VERIFIER_ROLE, verifierAddress);
  await landRegistry.grantRole(GOVERNOR_ROLE, governorAddress);

  console.log("Roles granted successfully!");
  console.log("-----------------------------------------");
  console.log(`Add this address to your .env file:\nLAND_REGISTRY_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
