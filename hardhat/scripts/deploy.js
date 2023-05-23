
const hre = require("hardhat");

async function main() {

  const whitelist = await hre.ethers.getContractFactory("Whitelist");
  const whitelistContract = await whitelist.deploy(10);

  await whitelistContract.deployed();

  console.log(
    `Whitelist contract deployed to ${whitelistContract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
