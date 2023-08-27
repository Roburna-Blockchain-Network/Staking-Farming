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
  const mockTokenContract = await ethers.getContractFactory("MockToken")

  /**
   * deploy open staking contract
   */

  const rbaToken = await mockTokenContract.deploy("Roburna", "RBA", {
    gasPrice: gasPrice
  });

  await rbaToken.deployed();

  const usdcToken = await mockTokenContract.deploy("USDC", "USDC", {
    gasPrice: gasPrice
  });
  await usdcToken.deployed();

  const openStaking = await openStakingContract.deploy(rbaToken.address, rbaToken.address,
    {
      gasPrice: gasPrice
    });
  await openStaking.deployed();

  const openStakingTreasury = await tresuaryContract.deploy(
    openStaking.address,
    rbaToken.address,
    usdcToken.address,
    {
      gasPrice: gasPrice
    }
  );

  await openStakingTreasury.deployed();

  const openStakingReward = await rewardWalletContract.deploy(
    rbaToken.address,
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
    rbaToken.address,
    rbaToken.address,
    config.lock3yStaking.lockTime,
    config.lock3yStaking.rate,
    {
      gasPrice: gasPrice
    }
  );

  await lock3yStaking.deployed();

  const lock3yStakingTreasury = await tresuaryContract.deploy(
    lock3yStaking.address,
    rbaToken.address,
    usdcToken.address,
    {
      gasPrice: gasPrice
    }
  );

  await lock3yStakingTreasury.deployed();

  const lock3yStakingReward = await rewardWalletContract.deploy(
    rbaToken.address,
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
    rbaToken.address,
    rbaToken.address,
    config.lock5yStaking.lockTime,
    config.lock5yStaking.rate,
    {
      gasPrice: gasPrice
    }
  );

  await lock5yStaking.deployed();

  const lock5yStakingTreasury = await tresuaryContract.deploy(
    lock5yStaking.address,
    rbaToken.address,
    usdcToken.address,
    {
      gasPrice: gasPrice
    }
  );

  await lock5yStakingTreasury.deployed();

  const lock5yStakingReward = await rewardWalletContract.deploy(
    rbaToken.address,
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
      constructorArguments: [rbaToken.address, rbaToken.address],
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await hre.run("verify:verify", {
      address: lock3yStaking.address,
      contract: "contracts/Staking/ArborStakingLock.sol:ArborStakingLock",
      constructorArguments: [
        rbaToken.address,
        rbaToken.address,
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
        rbaToken.address,
        usdcToken.address,
      ],
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await hre.run("verify:verify", {
      address: openStakingReward.address,
      contract: "contracts/Staking/RewardWallet.sol:RewardWallet",
      constructorArguments: [rbaToken.address, openStaking.address],
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await hre.run("verify:verify", {
      address: rbaToken.address,
      contract: "contracts/MockToken.sol:MockToken",
      constructorArguments: ["Roburna", "RBA"],
    });
  } catch (error) {
    console.log(error);
  }


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
  console.log('rbaToken address: ', rbaToken.address);
  console.log('usdc address: ', usdcToken.address);

  /**
   * approve rba to reward wallet and treasury
   */

  await rbaToken.approve(openStakingReward.address, ethers.constants.MaxUint256, {
    gasPrice: gasPrice
  });

  await rbaToken.approve(lock3yStakingReward.address, ethers.constants.MaxUint256, {
    gasPrice: gasPrice
  });

  await rbaToken.approve(lock5yStakingReward.address, ethers.constants.MaxUint256, {
    gasPrice: gasPrice
  });

  await rbaToken.approve(openStakingTreasury.address, ethers.constants.MaxUint256, {
    gasPrice: gasPrice
  });

  await rbaToken.approve(lock3yStakingTreasury.address, ethers.constants.MaxUint256, {
    gasPrice: gasPrice
  });

  await rbaToken.approve(lock5yStakingTreasury.address, ethers.constants.MaxUint256, {
    gasPrice: gasPrice
  });

  /**
   * deposit to reward wallet
   */

  await openStakingReward.deposit(thousand, {
    gasPrice: gasPrice
  });

  await lock3yStakingReward.deposit(thousand, {
    gasPrice: gasPrice
  });

  await lock5yStakingReward.deposit(thousand, {
    gasPrice: gasPrice
  });


  /**
   * start staking
   */

  await openStaking.stake(hundred, {
    gasPrice: gasPrice
  })

  await lock3yStaking.stake(hundred, {
    gasPrice: gasPrice
  })

  await lock5yStaking.stake(hundred, {
    gasPrice: gasPrice
  })


  /**
   * test withdraw reward
   * 
   */

  await openStaking.withdrawRewards({
    gasPrice: gasPrice
  })

  await lock3yStaking.withdrawRewards({
    gasPrice: gasPrice
  })

  await lock5yStaking.withdrawRewards({
    gasPrice: gasPrice
  })

  /**
   * test withdraw stake
   */

  await openStaking.unstake(hundred, {
    gasPrice: gasPrice
  })

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});