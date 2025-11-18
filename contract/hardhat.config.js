require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.30",
  networks: {
    // This network configuration is for a local Ganache instance
    ganache: {
      url: "http://127.0.0.1:8545", 
      accounts: [
        // Add the private key of youraccount for admin before running deployment scripts
        "0xe439481475f67fc5468836f6c8972cab468b7c0b7110c12f1860127d7019e2cd"
      ]
    }
  }
};