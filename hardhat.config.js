

require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");


module.exports = {
  networks: {
    hardhat:{
      forking: {
        url: "https://bsc-dataseed1.binance.org/",
        allowUnlimitedContractSize: true,
        chainId:56
      }
      
    },
    binance: {
       url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
       accounts:['dfc7f5fef4cd7582662eeff2917f8eaed8343f05035d3484171b502627f49737'],
       allowUnlimitedContractSize: true
    }
    
  },  
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: 'MMTH9PCYDD18ZYA6TKHA51TUKEJ536C33P',
    
  },
  
    solidity: {
      compilers: [
        {
          version: "0.8.0",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        },
        {
          version: "0.8.7",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        },
        {
          version: "0.8.11",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        },

        {
          version: "0.5.16",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        },

      ],
    
  },
 
};
