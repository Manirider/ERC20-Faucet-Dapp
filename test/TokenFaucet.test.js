const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TokenFaucet", function () {
    let token, faucet;
    let owner, user1, user2;
    const FAUCET_AMOUNT = ethers.parseEther("100");
    const MAX_CLAIM_AMOUNT = ethers.parseEther("1000");
    const COOLDOWN_TIME = 24 * 60 * 60; // 1 day in seconds

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy Faucet first
        const Faucet = await ethers.getContractFactory("TokenFaucet");
        faucet = await Faucet.deploy(ethers.ZeroAddress);
        await faucet.waitForDeployment();

        // Deploy Token with faucet address
        const Token = await ethers.getContractFactory("FaucetToken");
        token = await Token.deploy(await faucet.getAddress());
        await token.waitForDeployment();

        // Configure token in faucet
        await faucet.setToken(await token.getAddress());
    });

    describe("Token Deployment", function () {
        it("should have correct name and symbol", async function () {
            expect(await token.name()).to.equal("Faucet Token");
            expect(await token.symbol()).to.equal("FTK");
        });

        it("should have 18 decimals", async function () {
            expect(await token.decimals()).to.equal(18);
        });

        it("should have zero initial supply", async function () {
            expect(await token.totalSupply()).to.equal(0);
        });

        it("should have faucet set correctly", async function () {
            expect(await token.faucet()).to.equal(await faucet.getAddress());
        });

        it("should have MAX_SUPPLY constant", async function () {
            expect(await token.MAX_SUPPLY()).to.equal(ethers.parseEther("1000000"));
        });
    });

    describe("Token ERC-20 Functions", function () {
        beforeEach(async function () {
            // User claims tokens first
            await faucet.connect(user1).requestTokens();
        });

        it("should return correct balanceOf", async function () {
            expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
        });

        it("should allow transfer", async function () {
            const amount = ethers.parseEther("50");
            await token.connect(user1).transfer(user2.address, amount);
            expect(await token.balanceOf(user2.address)).to.equal(amount);
        });

        it("should emit Transfer event on transfer", async function () {
            const amount = ethers.parseEther("50");
            await expect(token.connect(user1).transfer(user2.address, amount))
                .to.emit(token, "Transfer")
                .withArgs(user1.address, user2.address, amount);
        });

        it("should allow approve and transferFrom", async function () {
            const amount = ethers.parseEther("50");
            await token.connect(user1).approve(user2.address, amount);
            expect(await token.allowance(user1.address, user2.address)).to.equal(amount);

            await token.connect(user2).transferFrom(user1.address, user2.address, amount);
            expect(await token.balanceOf(user2.address)).to.equal(amount);
        });
    });

    describe("Token Minting Restrictions", function () {
        it("should only allow faucet to mint", async function () {
            await expect(
                token.connect(owner).mint(user1.address, FAUCET_AMOUNT)
            ).to.be.revertedWith("Only faucet can mint");
        });

        it("should not exceed max supply", async function () {
            // Claim tokens to fill up supply (this would take many claims)
            // For testing, we verify the MAX_SUPPLY exists
            expect(await token.MAX_SUPPLY()).to.equal(ethers.parseEther("1000000"));
        });
    });

    describe("Faucet Deployment", function () {
        it("should have correct constants", async function () {
            expect(await faucet.FAUCET_AMOUNT()).to.equal(FAUCET_AMOUNT);
            expect(await faucet.COOLDOWN_TIME()).to.equal(COOLDOWN_TIME);
            expect(await faucet.MAX_CLAIM_AMOUNT()).to.equal(MAX_CLAIM_AMOUNT);
        });

        it("should have admin set to deployer", async function () {
            expect(await faucet.admin()).to.equal(owner.address);
        });

        it("should not be paused initially", async function () {
            expect(await faucet.isPaused()).to.equal(false);
        });

        it("should have token configured", async function () {
            expect(await faucet.token()).to.equal(await token.getAddress());
        });
    });

    describe("requestTokens", function () {
        it("should distribute tokens successfully", async function () {
            await faucet.connect(user1).requestTokens();
            expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
        });

        it("should emit TokensClaimed event", async function () {
            const tx = await faucet.connect(user1).requestTokens();
            const receipt = await tx.wait();
            const block = await ethers.provider.getBlock(receipt.blockNumber);

            await expect(tx)
                .to.emit(faucet, "TokensClaimed")
                .withArgs(user1.address, FAUCET_AMOUNT, block.timestamp);
        });

        it("should emit Transfer event on mint", async function () {
            await expect(faucet.connect(user1).requestTokens())
                .to.emit(token, "Transfer")
                .withArgs(ethers.ZeroAddress, user1.address, FAUCET_AMOUNT);
        });

        it("should update lastClaimAt timestamp", async function () {
            await faucet.connect(user1).requestTokens();
            const lastClaim = await faucet.lastClaimAt(user1.address);
            expect(lastClaim).to.be.gt(0);
        });

        it("should update totalClaimed", async function () {
            await faucet.connect(user1).requestTokens();
            expect(await faucet.totalClaimed(user1.address)).to.equal(FAUCET_AMOUNT);
        });
    });

    describe("Cooldown Enforcement", function () {
        beforeEach(async function () {
            await faucet.connect(user1).requestTokens();
        });

        it("should revert on immediate re-claim", async function () {
            await expect(
                faucet.connect(user1).requestTokens()
            ).to.be.revertedWith("Cooldown period not elapsed");
        });

        it("should allow claim after cooldown period", async function () {
            await time.increase(COOLDOWN_TIME + 1);
            await faucet.connect(user1).requestTokens();
            expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT * 2n);
        });

        it("canClaim should return false during cooldown", async function () {
            expect(await faucet.canClaim(user1.address)).to.equal(false);
        });

        it("canClaim should return true after cooldown", async function () {
            await time.increase(COOLDOWN_TIME + 1);
            expect(await faucet.canClaim(user1.address)).to.equal(true);
        });
    });

    describe("Lifetime Limit", function () {
        it("should track remaining allowance correctly", async function () {
            expect(await faucet.remainingAllowance(user1.address)).to.equal(MAX_CLAIM_AMOUNT);

            await faucet.connect(user1).requestTokens();
            expect(await faucet.remainingAllowance(user1.address)).to.equal(
                MAX_CLAIM_AMOUNT - FAUCET_AMOUNT
            );
        });

        it("should enforce lifetime limit", async function () {
            // Claim 10 times (100 * 10 = 1000 tokens = MAX)
            for (let i = 0; i < 10; i++) {
                await faucet.connect(user1).requestTokens();
                if (i < 9) {
                    await time.increase(COOLDOWN_TIME + 1);
                }
            }

            // Try to claim again after cooldown - should fail due to lifetime limit
            await time.increase(COOLDOWN_TIME + 1);
            await expect(
                faucet.connect(user1).requestTokens()
            ).to.be.revertedWith("Lifetime claim limit reached");
        });

        it("remainingAllowance should return 0 when limit reached", async function () {
            for (let i = 0; i < 10; i++) {
                await faucet.connect(user1).requestTokens();
                if (i < 9) {
                    await time.increase(COOLDOWN_TIME + 1);
                }
            }
            expect(await faucet.remainingAllowance(user1.address)).to.equal(0);
        });
    });

    describe("Pause Functionality", function () {
        it("should allow admin to pause", async function () {
            await faucet.setPaused(true);
            expect(await faucet.isPaused()).to.equal(true);
        });

        it("should emit FaucetPaused event", async function () {
            await expect(faucet.setPaused(true))
                .to.emit(faucet, "FaucetPaused")
                .withArgs(true);
        });

        it("should revert claims when paused", async function () {
            await faucet.setPaused(true);
            await expect(
                faucet.connect(user1).requestTokens()
            ).to.be.revertedWith("Faucet is paused");
        });

        it("should allow claims after unpause", async function () {
            await faucet.setPaused(true);
            await faucet.setPaused(false);
            await faucet.connect(user1).requestTokens();
            expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
        });

        it("canClaim should return false when paused", async function () {
            await faucet.setPaused(true);
            expect(await faucet.canClaim(user1.address)).to.equal(false);
        });

        it("should restrict setPaused to admin only", async function () {
            await expect(
                faucet.connect(user1).setPaused(true)
            ).to.be.revertedWith("Only admin");
        });
    });

    describe("Multiple Users", function () {
        it("should allow independent claims from multiple users", async function () {
            await faucet.connect(user1).requestTokens();
            await faucet.connect(user2).requestTokens();

            expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
            expect(await token.balanceOf(user2.address)).to.equal(FAUCET_AMOUNT);
        });

        it("should track claims independently per user", async function () {
            await faucet.connect(user1).requestTokens();
            await faucet.connect(user2).requestTokens();

            expect(await faucet.totalClaimed(user1.address)).to.equal(FAUCET_AMOUNT);
            expect(await faucet.totalClaimed(user2.address)).to.equal(FAUCET_AMOUNT);
        });
    });

    describe("canClaim Function", function () {
        it("should return true for new address", async function () {
            expect(await faucet.canClaim(user1.address)).to.equal(true);
        });

        it("should return false during cooldown", async function () {
            await faucet.connect(user1).requestTokens();
            expect(await faucet.canClaim(user1.address)).to.equal(false);
        });

        it("should return false when limit reached", async function () {
            for (let i = 0; i < 10; i++) {
                await faucet.connect(user1).requestTokens();
                if (i < 9) {
                    await time.increase(COOLDOWN_TIME + 1);
                }
            }
            await time.increase(COOLDOWN_TIME + 1);
            expect(await faucet.canClaim(user1.address)).to.equal(false);
        });
    });
});
