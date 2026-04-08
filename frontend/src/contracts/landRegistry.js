/**
 * 🛡️ Sovereign Ledger: Blockchain Contract Bridge
 * This file contains the ABI and address for the LandRegistry smart contract.
 */

export const LAND_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Local Hardhat Default (Update for Amoy)

export const LAND_REGISTRY_ABI = [
  {
    "inputs": [
      { "internalType": "uint48", "name": "initialDelay", "type": "uint48" },
      { "internalType": "address", "name": "admin", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "parcelId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "claimant", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "reason", "type": "string" }
    ],
    "name": "DisputeFiled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "parcelId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string" }
    ],
    "name": "LandRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "parcelId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "TransferCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "parcelId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "TransferInitiated",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "parcelId", "type": "uint256" }],
    "name": "approveTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "parcelId", "type": "uint256" },
      { "internalType": "string", "name": "reason", "type": "string" }
    ],
    "name": "fileDispute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "parcelId", "type": "uint256" },
      { "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "initiateTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "string", "name": "gps", "type": "string" },
      { "internalType": "uint256", "name": "area", "type": "uint256" },
      { "internalType": "string", "name": "ipfsHash", "type": "string" }
    ],
    "name": "registerLand",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "parcelId", "type": "uint256" }],
    "name": "validateLegal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "parcelId", "type": "uint256" }],
    "name": "verifySurvey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registrationFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "disputeFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
     "inputs": [
        { "internalType": "uint256", "name": "parcelId", "type": "uint256" }
     ],
     "name": "parcels",
     "outputs": [
        { "internalType": "uint256", "name": "parcelId", "type": "uint256" },
        { "internalType": "string", "name": "gpsCoordinates", "type": "string" },
        { "internalType": "uint256", "name": "area", "type": "uint256" },
        { "internalType": "string", "name": "ipfsHash", "type": "string" },
        { "internalType": "address", "name": "currentOwner", "type": "address" },
        { "internalType": "enum LandRegistry.ParcelStatus", "name": "status", "type": "uint8" },
        { "internalType": "uint256", "name": "registrationTimestamp", "type": "uint256" }
     ],
     "stateMutability": "view",
     "type": "function"
  },
  {
    "inputs": [
       { "internalType": "uint256", "name": "parcelId", "type": "uint256" }
    ],
    "name": "transferRequests",
    "outputs": [
       { "internalType": "uint256", "name": "parcelId", "type": "uint256" },
       { "internalType": "address", "name": "from", "type": "address" },
       { "internalType": "address", "name": "to", "type": "address" },
       { "internalType": "enum LandRegistry.TransferStatus", "name": "status", "type": "uint8" },
       { "internalType": "bool", "name": "surveyorApproved", "type": "bool" },
       { "internalType": "bool", "name": "verifierApproved", "type": "bool" },
       { "internalType": "bool", "name": "registrarApproved", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const REGISTRAR_ROLE = '0x29147e08922416d843485121e428c04ec47182ba0c80ee334311136b8e21759d'; // keccak256("REGISTRAR_ROLE")
export const GOVERNOR_ROLE  = '0xa03cb2952402120468f7f1309f9f59fd54b5dfd461ec909247d86ec0b2de13cd'; // keccak256("GOVERNOR_ROLE")
