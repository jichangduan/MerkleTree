import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.SEPOLIA_RPC_URL;

    if (!privateKey || !rpcUrl) {
      throw new Error("请在.env文件中设置PRIVATE_KEY和SEPOLIA_RPC_URL");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const sender = "0xde01D3Bd612D52d95a6841b2acE7cE25cF74F95c";
    const recipient = "0xDA9210fceA659e2E6f7B25DDA66dABF122b29A8B";

    if (wallet.address.toLowerCase() !== sender.toLowerCase()) {
      throw new Error(`钱包地址 ${wallet.address} 与指定的发送方地址 ${sender} 不匹配`);
    }

    const amountToSend = ethers.parseEther("0.01");
    
    const tx = {
      to: recipient,
      value: amountToSend
    };

    console.log(`准备从 ${sender} 发送 0.01 ETH 到 ${recipient}`);
    
    const txResponse = await wallet.sendTransaction(tx);
    console.log(`交易已提交，交易哈希: ${txResponse.hash}`);
    
    const receipt = await txResponse.wait();
    console.log(`交易已确认，区块号: ${receipt?.blockNumber}`);
    console.log(`交易成功完成！`);
  } catch (error) {
    console.error("发送ETH时出错:", error);
  }
}

main(); 