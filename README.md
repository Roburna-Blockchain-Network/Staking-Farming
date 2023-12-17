

#   ArborStakingLock Smart Contract
## Overview

The ArborStakingLock is a smart contract for Ethereum-based blockchain platforms, designed to facilitate token staking and reward distribution. It incorporates features like staking, unstaking, reward calculation, and administrative controls. This contract is Ownable and Pausable, meaning it has ownership controls and can be paused by the owner for maintenance or emergency purposes.

## Features

    Staking and Unstaking Tokens: Users can stake tokens, which are then locked for a specified period. Unstaking is available after the lock period.
    Reward Calculation: Rewards are calculated based on the staking duration and amount.
    Administrative Functions: The owner can set the reward rate, treasury, and reward wallet.

## Contract Details

    Mappings:
        stakingBalance: Tracks the staking balance of each address.
        isStaking: Indicates if an address is currently staking.
        startTime: Stores the start time of staking for each address.
        userRewards: Keeps track of accumulated rewards for each user.
        userEndTime: The time when a user's staking period ends.
    Constants:
        YEAR_SECOND: Represents the number of seconds in a year, used for reward calculations.
    State Variables:
        rewardRate: The current reward rate percentage.
        oldRewardRate, rewardRateUpdatedTime: For tracking changes in reward rate.
        lockTime: The period for which tokens are locked when staked.
        isTresuarySet, isRewardWalletSet: Flags for setting treasury and reward wallet.
        tresuary, rewardWallet: Addresses for the treasury and reward wallet.
        stakingToken, rewardsToken: Addresses of the staking and rewards tokens.

## Key Functions

    Stake/Unstake Tokens:
        stake(uint256 amount): To stake a certain amount of tokens.
        unstake(uint256 amount): To unstake tokens after the lock period.
    Reward Management:
        getTotalRewards(address user): Calculates total rewards for a user.
        withdrawRewards(): Allows users to withdraw their accumulated rewards.
    Administrative Functions:
        setRewardRate(uint256 _rewardRate): Sets a new reward rate.
        setTresuary(address _tresuary): Sets the treasury address.
        setRewardWallet(address _rewardWallet): Sets the reward wallet address.
        setUnpause(), setPause(): To pause or unpause the contract.

## Events

    Stake, Unstake, RewardsWithdrawal: Events emitted for staking, unstaking, and reward withdrawal.
    LogSetRewardRate, LogSetTresuary, LogSetRewardWallet: Events for administrative actions.

## Getting Started

Interacting with the contract requires a balance of the staking token, and the contract's ABI and address. 


Approving Tokens for the Treasury

Before staking, tokens must be approved for transfer by the treasury. This is done by interacting with the token's contract:

const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
const approveTx = await tokenContract.approve(tresuaryAddress, amountToApprove);
await approveTx.wait();

Staking Tokens

After approval, you can stake tokens by interacting with the ArborStakingLock contract:

```
const stakingContract = new ethers.Contract(stakingContractAddress, stakingContractABI, signer);
const stakeTx = await stakingContract.stake(amountToStake);
await stakeTx.wait();
```

Unstaking Tokens

To unstake:

```
const unstakeTx = await stakingContract.unstake(amountToUnstake);
await unstakeTx.wait();
```

# Tresuary Smart Contract
## Overview

The Tresuary contract is a key component of a staking ecosystem, responsible for managing staking and dividend tokens. It automates the deposit and withdrawal of staking tokens and oversees the distribution of dividends. The contract is Ownable, with certain functions accessible only by the owner (staking contract) or a designated deployer.

## Features

    Automated Token Management: Handles staking and dividend tokens in coordination with the staking contract.
    User Rewards: Calculates and distributes rewards to stakers based on their staked amounts.
    Withdrawal of Dividends: Enables users to manually withdraw their dividend earnings.
    Administrative Functions: Provides controls for the deployer to manage the contract's operations.

## Contract Details

    State Variables:
        stakingContract: The address of the associated staking contract.
        deployer: The address of the deployer with special administrative privileges.
        stakingToken, dividendToken: ERC20 tokens used for staking and dividends.
        UserInfo: A structure storing user-specific data like staked amount and reward debt.
    Key Functions:
        withdrawDividends(): Allows users to withdraw their accumulated dividends.
        updateReward(): Updates reward variables for accurate calculation.
        getUserInfo(address _user): Returns user-specific information, such as staked amount and rewards.
        pendingReward(address _user): Calculates pending rewards for a user.
    Administrative Functions:
        withdrawBNB(address payable account, uint256 amount): Withdraws BNB.
        withdrawToken(address token, address account, uint256 amount): Withdraws specified tokens.
        updateDeployerAddress(address newDeployer): Updates the deployer address.

## Interacting with the Contract

Example Usage

Claiming Dividends

```
const tresuaryContract = new ethers.Contract(tresuaryAddress, tresuaryABI, signer);
const claimDividendsTx = await tresuaryContract.withdrawDividends();
await claimDividendsTx.wait();
```


