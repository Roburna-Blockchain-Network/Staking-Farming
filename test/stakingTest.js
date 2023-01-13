const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking", function () {

  before(async function () {
    
    this.Staking = await ethers.getContractFactory("ArborStaking")
    this.Tresuary = await ethers.getContractFactory("Tresuary")
    this.Rewardwallet = await ethers.getContractFactory("RewardWallet")
    this.DivToken = await ethers.getContractFactory("DividendToken")
    this.StakingToken = await ethers.getContractFactory("StakingToken")
    this.signers = await ethers.getSigners()
    this.owner = this.signers[0]
    this.vault1 = this.signers[5]
    this.vault2 = this.signers[3]
    this.farm = this.signers[4]
    this.alice = this.signers[2]
    this.bob = this.signers[1]
    this.charlie = this.signers[6]
    this.provider = await ethers.provider
    this.burnWallet = "0x000000000000000000000000000000000000dEaD"
    
  

    this.stakingToken = await this.StakingToken.deploy()
    await this.stakingToken.deployed()   

    this.divToken = await this.DivToken.deploy()
    await this.divToken.deployed()
  
    this.staking = await this.Staking.deploy(this.stakingToken.address, this.stakingToken.address);
    await this.staking.deployed()   

    this.tresuary = await this.Tresuary.deploy(this.staking.address, this.stakingToken.address, this.divToken.address)
    await this.tresuary.deployed()

    this.rewardwallet = await this.Rewardwallet.deploy(this.stakingToken.address, this.staking.address)
    await this.rewardwallet.deployed() 

    
     
    await this.stakingToken.transfer(this.alice.address, ethers.utils.parseEther("100000"))
    await this.stakingToken.transfer(this.bob.address, ethers.utils.parseEther("100000"))
    await this.stakingToken.transfer(this.charlie.address, ethers.utils.parseEther("100000"))

    await this.divToken.transfer(this.tresuary.address, ethers.utils.parseEther("100000"))
  })

  it("RewardWallet handles deposits correctly ", async function () {
    await this.stakingToken.approve(this.rewardwallet.address, ethers.utils.parseEther("100000"))
    await this.rewardwallet.deposit(ethers.utils.parseEther("100000"))  

    expect(await this.rewardwallet.getTotalDeposited()).to.equal(ethers.utils.parseEther("100000"))
  })

  it("Make sure it sets reward wallet and treasury correctly", async function () {
    await this.staking.setTresuary(this.tresuary.address)
    await this.staking.setRewardWallet(this.rewardwallet.address) 

    expect(await this.staking.tresuary()).to.equal(this.tresuary.address)
    expect(await this.staking.rewardWallet()).to.equal(this.rewardwallet.address)
  })



  it("should handle deposits correctly", async function () {
    await this.stakingToken.connect(this.alice).approve(this.tresuary.address, ethers.utils.parseEther("100000"))
    await this.staking.connect(this.alice).stake(ethers.utils.parseEther("30000"))
    await this.staking.connect(this.alice).stake(ethers.utils.parseEther("30000"))
   
    await this.stakingToken.connect(this.charlie).approve(this.tresuary.address, ethers.utils.parseEther("100000"))
    await this.staking.connect(this.charlie).stake(ethers.utils.parseEther("30000"))
    await this.staking.connect(this.charlie).stake(ethers.utils.parseEther("30000"))

    await this.stakingToken.connect(this.bob).approve(this.tresuary.address, ethers.utils.parseEther("100000"))
    await this.staking.connect(this.bob).stake(ethers.utils.parseEther("30000"))
    
  })

  it("should withdraw rewards correctly", async function () {
    let alicebalBe4 = await this.stakingToken.balanceOf(this.alice.address)
    let balBe4 = ethers.utils.formatEther(alicebalBe4)
    await this.staking.connect(this.alice).withdrawRewards()

    let alicebal = await this.stakingToken.balanceOf(this.alice.address)
    let bal = ethers.utils.formatEther(alicebal)
    console.log(bal, 'bal')
    console.log(balBe4, 'balBe4');

  })

  it("should handle withdrawals correctly", async function () {
    await this.divToken.transfer(this.tresuary.address, ethers.utils.parseEther("100000"))
    let alicebal = await this.divToken.balanceOf(this.alice.address)
    let bal = ethers.utils.formatEther(alicebal)
    console.log(bal)
    await this.staking.connect(this.alice).unstake(ethers.utils.parseEther("10000"))
    let alicebalAfter = await this.divToken.balanceOf(this.alice.address)
    let balAfter = ethers.utils.formatEther(alicebalAfter)
    console.log(bal, 'divBalb4')
    console.log(balAfter, 'divbalAfter')
  })


  it(" Make sure it calculates rewards after updated reward rate correctly ", async function () {
    await this.staking.connect(this.alice).withdrawRewards()

    let alicebal = await this.stakingToken.balanceOf(this.alice.address)
    let bal = ethers.utils.formatEther(alicebal)
    console.log(bal)


  })

  it("Returns correct rewardrate", async function (){
    let rate = await this.staking.getRewardRate()
    expect(rate).to.equal(10)
  })

  it("Set's isStaking to false if user balance 0", async function (){
    await this.staking.connect(this.bob).unstake(ethers.utils.parseEther("30000"))
    expect(await this.staking.isStaking(this.bob.address)).to.equal(false)
  })

  it.only("Withdraw divs externally", async function (){

    await this.staking.setTresuary(this.tresuary.address)
    await this.staking.setRewardWallet(this.rewardwallet.address) 

    await this.stakingToken.connect(this.alice).approve(this.tresuary.address, ethers.utils.parseEther("100000"))
    await this.staking.connect(this.alice).stake(ethers.utils.parseEther("30000"))
    await this.staking.connect(this.alice).stake(ethers.utils.parseEther("30000"))
   
    await this.stakingToken.connect(this.charlie).approve(this.tresuary.address, ethers.utils.parseEther("100000"))
    await this.staking.connect(this.charlie).stake(ethers.utils.parseEther("30000"))
    await this.staking.connect(this.charlie).stake(ethers.utils.parseEther("30000"))

    await this.stakingToken.connect(this.bob).approve(this.tresuary.address, ethers.utils.parseEther("100000"))
    await this.staking.connect(this.bob).stake(ethers.utils.parseEther("30000"))

    let alicebal = await this.divToken.balanceOf(this.alice.address)
    let bal = ethers.utils.formatEther(alicebal)

    await this.divToken.transfer(this.tresuary.address, ethers.utils.parseEther("100000"))

     await this.tresuary.connect(this.alice).withdrawDividends();
     await this.divToken.transfer(this.tresuary.address, ethers.utils.parseEther("100"))
     await this.tresuary.connect(this.alice).withdrawDividends();

   // await this.staking.connect(this.alice).unstake(ethers.utils.parseEther("60000"))
    
    let alicebalAfter = await this.divToken.balanceOf(this.alice.address)
    let balAfter = ethers.utils.formatEther(alicebalAfter)

    console.log(bal, 'divBalb4')
    console.log(balAfter, 'divbalAfter')
  })




})  
