const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  this.Staking = await ethers.getContractFactory("ArborStaking")
  this.Tresuary = await ethers.getContractFactory("Tresuary")
  this.Rewardwallet = await ethers.getContractFactory("RewardWallet")
  this.StakingToken = await ethers.getContractFactory("StakingToken")
  this.DividendToken = await ethers.getContractFactory("DividendToken")

  

  this.stakingToken = await this.StakingToken.deploy()
  await this.stakingToken.deployed()

  this.dividendToken = await this.DividendToken.deploy()
  await this.dividendToken.deployed()
  
  this.staking = await this.Staking.deploy(this.stakingToken.address, this.stakingToken.address)
  await this.staking.deployed()   

  this.tresuary = await this.Tresuary.deploy(this.staking.address, this.stakingToken.address, this.dividendToken.address)
  await this.tresuary.deployed()  

  this.rewardwallet = await this.Rewardwallet.deploy(this.stakingToken.address, this.staking.address)
  await this.rewardwallet.deployed() 
  
 
  console.log("dividendToken deployed to:", this.dividendToken.address);
  console.log("stakingToken deployed to:", this.stakingToken.address);
  console.log("staking deployed to:", this.staking.address);
  console.log("tresuary deployed to:", this.tresuary.address);
  console.log("rewardwallet deployed to:", this.rewardwallet.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});