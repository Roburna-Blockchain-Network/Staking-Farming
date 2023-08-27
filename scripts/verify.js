const { ethers } = require("hardhat");
const hre = require("hardhat");


const rba_address = '0xc5115d03385C7D899c7950A7F9491A91a69EdF7B'
const usdc_address = '0x864A503a566c2fB7DA66a46Ae171A1Dc099941b9'
const staking_address = '0xE4074df7eFA5B68CA15116da1714905588a5e90B'
const tresuary_address = '0xE24a430EB5054B10adD3CCb64113235f74ccF8d9'
const rewardWallet_address = '0x99163d2F43B96BD191f1Ee84416d78cf367B10c4'

async function main() {
  const [deployer] = await ethers.getSigners();

  // get gas price
  const gasPrice = await hre.ethers.provider.getGasPrice();

  let stakingContract = await ethers.getContractAt("ArborStakingOpen", staking_address)
  let rbaContract = await ethers.getContractAt("MockToken", rba_address)
  let tresuaryContract = await ethers.getContractAt("contracts/Staking/Tresuary.sol:Tresuary", tresuary_address)
  let rewardWalletContract = await ethers.getContractAt("contracts/Staking/RewardWallet.sol:RewardWallet", rewardWallet_address)

  // set reward address

  await stakingContract.setRewardWallet(rewardWallet_address, {
    gasPrice: gasPrice
  })

  // set tresuary address

  await stakingContract.setTresuary(tresuary_address, {
    gasPrice: gasPrice
  })


}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});