

   ArborStakingLock Smart Contract
Overview

The ArborStakingLock is a smart contract for Ethereum-based blockchain platforms, designed to facilitate token staking and reward distribution. It incorporates features like staking, unstaking, reward calculation, and administrative controls. This contract is Ownable and Pausable, meaning it has ownership controls and can be paused by the owner for maintenance or emergency purposes.
Features

    Staking and Unstaking Tokens: Users can stake tokens, which are then locked for a specified period. Unstaking is available after the lock period.
    Reward Calculation: Rewards are calculated based on the staking duration and amount.
    Administrative Functions: The owner can set the reward rate, treasury, and reward wallet.

Contract Details

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

Key Functions

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

Events

    Stake, Unstake, RewardsWithdrawal: Events emitted for staking, unstaking, and reward withdrawal.
    LogSetRewardRate, LogSetTresuary, LogSetRewardWallet: Events for administrative actions.

Getting Started

Interacting with the contract requires a balance of the staking token, and the contract's ABI and address.

1. SETUP
   F4H
   1. initializeDividendTracker(DT_ADDRESS)
   2. setTransfersEnabled(true)
   3. setDexTradesEnabled(true)
   4. setAtomatedMarketMakerPair(TRESUARY_ADDRESS)
   5. includeInDividends(TRESUARY_ADDRESS)
   6. excludeFromFees(TRESUARY_ADDRESS)
   
   STAKING CONTRACT
   1. setRewardWallet(REWARD_WALLET)
   2. setTresuary(TRESUARY_ADDRESS)

2. DESCRIPTION
   
   REWARD WALLET:
   1. deployer can deposit reward tokens using deposit() function
   2. staking contract is the owner. It takes rewards from the reward wallet. users can withdraw rewards through staking contract that calls transfer() function on reward wallet

   TRESUARY:
   1. holds staked f4h
   2. receives dividends
   3. distributes dividends automatically during stake/unstake
   4. staking contract is the owner 
   5. when stake() is called on the staking contract it calls deposit() on tresury contract
   6. when unstake() is called on the staking contract it calls withdraw() on tresury contract

   STAKING CONTRCAT:
   1. keeps track of user balances
   2. a user can withdraw rewards 
   3. owner can set the reward rate

3. HOW TO STAKE:
   1. approve f4h for tresuary address 
   2. stake

4. HOW TO UNSTAKE:
   1. unstake 

5. HOW TO WITHDRAW REWARDS:
   1. withdarwRewards   

6.  HOW TO WITHDRAW DIVIDENDS: 
   1. it's distributed automatically when stake/unstake 


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



