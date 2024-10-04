"use client";

import { ethers } from 'ethers';
import { coffeeContractABI, coffeeContractAddress } from './web3Config';

export const buyCoffee = async () => {
  if (typeof window.ethereum === 'undefined') {
    alert("请安装MetaMask或其他Web3钱包");
    return false;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(coffeeContractAddress, coffeeContractABI, signer);

    const coffeePrice = await contract.COFFEE_PRICE();
    const tx = await contract.buyCoffee({ value: coffeePrice });
    await tx.wait();

    alert("咖啡购买成功！AI顾问们现在精力充沛了！");
    return true;
  } catch (error) {
    console.error("购买咖啡时出错:", error);
    alert("购买咖啡失败。请重试。");
    return false;
  }
};
