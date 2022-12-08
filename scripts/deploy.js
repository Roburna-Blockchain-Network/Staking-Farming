const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  this.Staking = await ethers.getContractFactory("ArborStaking")
  this.Tresuary = await ethers.getContractFactory("Tresuary")
  this.Rewardwallet = await ethers.getContractFactory("RewardWallet")
  this.RewToken = await ethers.getContractFactory("SaleToken")

  const f4h = "0x4b5292459cCd09F62A0Ed9984FbfDefD75f0618E"
  const rba = '0x8ea9Ac6bA8f19ce40FE20C7e505378104DF8fb77'

  this.revToken = await this.RewToken.deploy()
  await this.revToken.deployed()
  
  this.staking = await this.Staking.deploy(f4h, this.revToken.address)
  await this.staking.deployed()   

  this.tresuary = await this.Tresuary.deploy(this.staking.address, f4h, rba)
  await this.tresuary.deployed()  

  this.rewardwallet = await this.Rewardwallet.deploy(this.revToken.address, this.staking.address)
  await this.rewardwallet.deployed() 
  
 

  console.log("revToken deployed to:", this.revToken.address);
  console.log("staking deployed to:", this.staking.address);
  console.log("tresuary deployed to:", this.tresuary.address);
  console.log("rewardwallet deployed to:", this.rewardwallet.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});