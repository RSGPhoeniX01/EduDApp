const hre = require("hardhat");

async function main() {
  const Education = await hre.ethers.getContractFactory("Education");
  const education = await Education.deploy();

  await education.waitForDeployment();

  const contractAddress = await education.getAddress();
  console.log("Education contract deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});