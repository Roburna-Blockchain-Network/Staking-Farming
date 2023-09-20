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
  const lockStakingContract = await ethers.getContractFactory("ArborStakingLock")
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

  /**
   * deploy 3 years lock
   */

  const lock3yStaking = await lockStakingContract.deploy(
    config.address.roburna,
    config.address.roburna,
    config.lock3yStaking.lockTime,
    config.lock3yStaking.rate,
    {
      gasPrice: gasPrice
    }
  );

  await lock3yStaking.deployed();

  const lock3yStakingTreasury = await tresuaryContract.deploy(
    lock3yStaking.address,
    config.address.roburna,
    config.address.usdc,
    {
      gasPrice: gasPrice
    }
  );

  await lock3yStakingTreasury.deployed();

  const lock3yStakingReward = await rewardWalletContract.deploy(
    config.address.roburna,
    lock3yStaking.address,
    {
      gasPrice: gasPrice
    }
  );

  await lock3yStakingReward.deployed();

  await lock3yStaking.setRewardWallet(lock3yStakingReward.address, {
    gasPrice: gasPrice
  });

  await lock3yStaking.setTresuary(lock3yStakingTreasury.address, {
    gasPrice: gasPrice
  });


  /**
   * deploy 5 years lock
   */

  const lock5yStaking = await lockStakingContract.deploy(
    config.address.roburna,
    config.address.roburna,
    config.lock5yStaking.lockTime,
    config.lock5yStaking.rate,
    {
      gasPrice: gasPrice
    }
  );

  await lock5yStaking.deployed();

  const lock5yStakingTreasury = await tresuaryContract.deploy(
    lock5yStaking.address,
    config.address.roburna,
    config.address.usdc,
    {
      gasPrice: gasPrice
    }
  );

  await lock5yStakingTreasury.deployed();

  const lock5yStakingReward = await rewardWalletContract.deploy(
    config.address.roburna,
    lock5yStaking.address,
    {
      gasPrice: gasPrice
    }
  );

  await lock5yStakingReward.deployed();

  await lock5yStaking.setRewardWallet(lock5yStakingReward.address, {
    gasPrice: gasPrice
  });

  await lock5yStaking.setTresuary(lock5yStakingTreasury.address, {
    gasPrice: gasPrice
  });

  /**
   * verify contract
   */

  try {
    await hre.run("verify:verify", {
      address: openStaking.address,
      contract: "contracts/Staking/ArborStakingOpen.sol:ArborStakingOpen",
      constructorArguments: [config.address.roburna, config.address.roburna],
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await hre.run("verify:verify", {
      address: lock3yStaking.address,
      contract: "contracts/Staking/ArborStakingLock.sol:ArborStakingLock",
      constructorArguments: [
        config.address.roburna,
        config.address.roburna,
        config.lock3yStaking.lockTime,
        config.lock3yStaking.rate,
      ],
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await hre.run("verify:verify", {
      address: openStakingTreasury.address,
      contract: "contracts/Staking/Tresuary.sol:Tresuary",
      constructorArguments: [
        openStaking.address,
        config.address.roburna,
        config.address.usdc,
      ],
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await hre.run("verify:verify", {
      address: openStakingReward.address,
      contract: "contracts/Staking/RewardWallet.sol:RewardWallet",
      constructorArguments: [config.address.roburna, openStaking.address],
    });
  } catch (error) {
    console.log(error);
  }

  // try {
  //   await hre.run("verify:verify", {
  //     address: config.address.roburna,
  //     contract: "contracts/MockToken.sol:MockToken",
  //     constructorArguments: ["Roburna", "RBA"],
  //   });
  // } catch (error) {
  //   console.log(error);
  // }


  /**
   * console all address
   */

  console.log('openStaking address: ', openStaking.address);
  console.log('lock3yStaking address: ', lock3yStaking.address);
  console.log('lock5yStaking address: ', lock5yStaking.address);
  console.log('openStakingTreasury address: ', openStakingTreasury.address);
  console.log('lock3yStakingTreasury address: ', lock3yStakingTreasury.address);
  console.log('lock5yStakingTreasury address: ', lock5yStakingTreasury.address);
  console.log('openStakingReward address: ', openStakingReward.address);
  console.log('lock3yStakingReward address: ', lock3yStakingReward.address);
  console.log('lock5yStakingReward address: ', lock5yStakingReward.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});