const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CoffeeContract = await ethers.getContractFactory("CoffeeContract");
  const coffeeContract = await CoffeeContract.deploy();

  // 等待合约部署完成
  await coffeeContract.waitForDeployment();

  console.log("CoffeeContract deployed to:", await coffeeContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
