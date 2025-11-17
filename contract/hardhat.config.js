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
        "0x910a2e4157286dfbb92de5232bfb36311dffb34ee2a633f882c18e1c7c1eaf4a"
      ]
    }
  }
};