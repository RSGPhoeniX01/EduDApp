require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.30",
  networks: {
    // This network configuration is for a local Ganache instance
    ganache: {
      url: "http://127.0.0.1:8545", // Default Ganache-CLI URL
      accounts: [
        // Add the private key of your Ganache account here
        // IMPORTANT: This should be the account you want to be the ADMIN
        "YOUR_GANACHE_PRIVATE_KEY"
      ]
    }
  }
};