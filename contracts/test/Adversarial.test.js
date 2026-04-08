const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry Adversarial Tests", function () {
    let landRegistry, admin, registrar, surveyor, verifier, governor, owner1, owner2, attacker;
    let REGISTRAR_ROLE, SURVEYOR_ROLE, VERIFIER_ROLE, GOVERNOR_ROLE;

    beforeEach(async function () {
        [admin, registrar, surveyor, verifier, governor, owner1, owner2, attacker] = await ethers.getSigners();
        
        const LandRegistry = await ethers.getContractFactory("LandRegistry");
        landRegistry = await LandRegistry.deploy(0, admin.address);

        REGISTRAR_ROLE = await landRegistry.REGISTRAR_ROLE();
        SURVEYOR_ROLE = await landRegistry.SURVEYOR_ROLE();
        VERIFIER_ROLE = await landRegistry.VERIFIER_ROLE();
        GOVERNOR_ROLE = await landRegistry.GOVERNOR_ROLE();

        await landRegistry.connect(admin).grantRole(REGISTRAR_ROLE, registrar.address);
        await landRegistry.connect(admin).grantRole(SURVEYOR_ROLE, surveyor.address);
        await landRegistry.connect(admin).grantRole(VERIFIER_ROLE, verifier.address);
        await landRegistry.connect(admin).grantRole(GOVERNOR_ROLE, governor.address);
    });

    it("VULNERABILITY: Transfer can be approved even if parcel is Disputed or Frozen", async function () {
        // Register land
        await landRegistry.connect(registrar).registerLand(owner1.address, "GPS1", 100, "IPFS1", { value: ethers.parseEther("0.01") });

        // Initiate transfer
        await landRegistry.connect(owner1).initiateTransfer(1, owner2.address);
        await landRegistry.connect(surveyor).verifySurvey(1);
        await landRegistry.connect(verifier).validateLegal(1);

        // Before registrar approves, an attacker files a dispute
        await landRegistry.connect(attacker).fileDispute(1, "Fake claim", { value: ethers.parseEther("0.05") });
        
        let parcel = await landRegistry.parcels(1);
        expect(parcel.status).to.equal(2); // Disputed

        // Attempt to bypass state and approve transfer anyway
        // ADVERSARIAL FIX CONFIRMATION: This MUST fail with 'Parcel is not active'
        await expect(
            landRegistry.connect(registrar).approveTransfer(1)
        ).to.be.revertedWithCustomError(landRegistry, "ParcelNotActive");
    });
});
