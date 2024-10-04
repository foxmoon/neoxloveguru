require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = "yourprikye87487c70";

module.exports = {
  solidity: "0.8.19",
  networks: {
    neoxt4: {
      url: "https://neoxt4seed1.ngd.network",
      chainId: 12227332,
      accounts: [PRIVATE_KEY],
      gasPrice: 40000000000,
      timeout: 60000 // 增加超时时间到60秒,
    }
  }
};
