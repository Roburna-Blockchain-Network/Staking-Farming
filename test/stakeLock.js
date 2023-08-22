const { expect } = require("chai");
const { ethers } = require("hardhat");

const lockTimeEvm = 2 * 365 // 2 years
const lockTime = 2 * 60 * 60 * 24 * 365 // 2 years
const rewardRate = 12

const oneDay = 60 * 60 * 24

const unlockTime = lockTime + (2 * oneDay);



describe("Lock Staking", function () {

  before(async function () {

    let stakingContract = await ethers.getContractFactory("ArborStakingLock")
    let mockTokenContract = await ethers.getContractFactory("MockToken")
    let tresuaryContract = await ethers.getContractFactory("contracts/Staking/Tresuary.sol:Tresuary")
    let rewardWalletContract = await ethers.getContractFactory("contracts/Staking/RewardWallet.sol:RewardWallet")

    this.rbaToken = await mockTokenContract.deploy("Roburna", "RBA")
    this.usdcToken = await mockTokenContract.deploy("USDC", "USDC")

    await this.rbaToken.deployed()
    await this.usdcToken.deployed()



    this.stakingContract = await stakingContract.deploy(
      this.rbaToken.address,
      this.rbaToken.address,
      lockTimeEvm,
      rewardRate
    )

    await this.stakingContract.deployed()
    this.Tresuary = await tresuaryContract.deploy(
      this.stakingContract.address,
      this.rbaToken.address,
      this.usdcToken.address
    )
    await this.Tresuary.deployed()

    this.Rewardwallet = await rewardWalletContract.deploy(
      this.rbaToken.address,
      this.stakingContract.address
    )
    await this.Rewardwallet.deployed()


    this.signers = await ethers.getSigners()
    this.owner = this.signers[0]
    this.vault1 = this.signers[5]
    this.vault2 = this.signers[3]
    this.farm = this.signers[4]
    this.alice = this.signers[2]
    this.bob = this.signers[1]
    this.charlie = this.signers[6]
    this.provider = ethers.provider
    this.burnWallet = ethers.constants.AddressZero

    await this.rbaToken.transfer(this.alice.address, ethers.utils.parseEther("100000"))
    await this.rbaToken.transfer(this.bob.address, ethers.utils.parseEther("100000"))
    await this.rbaToken.transfer(this.charlie.address, ethers.utils.parseEther("100000"))

    await this.rbaToken.approve(this.Rewardwallet.address, ethers.utils.parseEther("100000"))
    await this.Rewardwallet.deposit(ethers.utils.parseEther("1000"))

  });

  it("Make sure it sets reward wallet and treasury correctly", async function () {
    await this.stakingContract.setTresuary(this.Tresuary.address)
    await this.stakingContract.setRewardWallet(this.Rewardwallet.address)

    expect(await this.stakingContract.rewardWallet()).to.equal(this.Rewardwallet.address)
    expect(await this.stakingContract.tresuary()).to.equal(this.Tresuary.address)
  })

  it("Alice Stakes 1000 RBA", async function () {
    await this.rbaToken.connect(this.alice).approve(this.Tresuary.address, ethers.utils.parseEther("100000"))
    await this.stakingContract.connect(this.alice).stake(ethers.utils.parseEther("1000"))

    // expect(await this.stakingContract.balanceOf(this.alice.address)).to.equal(ethers.utils.parseEther("1000"))
    expect(await this.rbaToken.balanceOf(this.alice.address)).to.equal(ethers.utils.parseEther("99000"))
    expect(await this.rbaToken.balanceOf(this.Tresuary.address)).to.equal(ethers.utils.parseEther("1000"))


  });

  it("Check Reward Balance", async function () {

    await ethers.provider.send('evm_increaseTime', [unlockTime]);
    await ethers.provider.send('evm_mine');


    const aliceReward = await this.stakingContract.getTotalRewards(this.alice.address);
    const rewardBalance = await this.rbaToken.balanceOf(this.Rewardwallet.address);

    console.log("Alice Reward: ", ethers.utils.formatEther(aliceReward))
    console.log("Reward Balance before Withdraw: ", ethers.utils.formatEther(rewardBalance))

    await this.stakingContract.connect(this.alice).withdrawRewards()

    const rewardBalanceAfter = await this.rbaToken.balanceOf(this.Rewardwallet.address);
    const aliceRewardAfter = await this.stakingContract.getTotalRewards(this.alice.address);


    const total = rewardBalanceAfter.add(aliceReward)

    console.log("Alice Reward after Withdraw: ", ethers.utils.formatEther(aliceRewardAfter))
    console.log("Reward Balance after Withdraw: ", ethers.utils.formatEther(rewardBalanceAfter))

    console.log("Total: ", ethers.utils.formatEther(total))

    // await this.stakingContract.connect(this.alice).unstake(ethers.utils.parseEther("1000"))

  })

  it("Can unstake", async function () {

    await this.stakingContract.connect(this.alice).unstake(ethers.utils.parseEther("1000"))

  })

});