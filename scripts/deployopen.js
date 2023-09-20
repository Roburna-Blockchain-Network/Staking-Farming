const { ethers } = require("hardhat");
const hre = require("hardhat");

const config = {
  address: {
    roburna: '0xDD534480782eCf53e4A5257B0f3C37702A0bAD61',
    usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  },
  openStaking: {
    rate: 2,
  },
  lock3yStaking: {
    rate: 5,
    lockTime: 3 * 365,
  },
  lock5yStaking: {
    rate: 8,
    lockTime: 5 * 365,
  },
}


const thousand = ethers.utils.parseEther("1000")
const hundred = ethers.utils.parseEther("100")

async function main() {

  const [deployer] = await ethers.getSigners();
  const gasPrice = await hre.ethers.provider.getGasPrice();

  /**
   * get contract factory
   */
  const openStakingContract = await ethers.getContractFactory("ArborStakingOpen")
  // const lockStakingContract = await ethers.getContractFactory("ArborStakingLock")
  const rewardWalletContract = await ethers.getContractFactory("contracts/Staking/RewardWallet.sol:RewardWallet")
  const tresuaryContract = await ethers.getContractFactory("contracts/Staking/Tresuary.sol:Tresuary")

  const openStaking = await openStakingContract.deploy(config.address.roburna, config.address.roburna,
    {
      gasPrice: gasPrice
    });
  await openStaking.deployed();

  const openStakingTreasury = await tresuaryContract.deploy(
    openStaking.address,
    config.address.roburna,
    config.address.usdc,
    {
      gasPrice: gasPrice
    }
  );

  await openStakingTreasury.deployed();

  const openStakingReward = await rewardWalletContract.deploy(
    config.address.roburna,
    openStaking.address,
    {
      gasPrice: gasPrice
    }
  );

  await openStakingReward.deployed();

  await openStaking.setRewardWallet(openStakingReward.address, {
    gasPrice: gasPrice
  });

  await openStaking.setTresuary(openStakingTreasury.address, {
    gasPrice: gasPrice
  });

  try {
    await hre.run("verify:verify", {
      address: openStaking.address,
      contract: "contracts/Staking/ArborStakingOpen.sol:ArborStakingOpen",
      constructorArguments: [config.address.roburna, config.address.roburna],
    });
  } catch (error) {
    console.log(error);
  }


  /**
   * console all address
   */

  console.log('openStaking address: ', openStaking.address);
  console.log('openStakingTreasury address: ', openStakingTreasury.address);
  console.log('openStakingReward address: ', openStakingReward.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});