
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






