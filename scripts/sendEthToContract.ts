import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { MerkleDapp__factory } from "../typechain-types";
dotenv.config();

async function main() {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!privateKey || !rpcUrl || !contractAddress) {
      throw new Error("请在.env文件中设置PRIVATE_KEY、SEPOLIA_RPC_URL和CONTRACT_ADDRESS");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const sender = "0xde01D3Bd612D52d95a6841b2acE7cE25cF74F95c";
    const recipient = contractAddress;

    if (wallet.address.toLowerCase() !== sender.toLowerCase()) {
      throw new Error(`钱包地址 ${wallet.address} 与指定的发送方地址 ${sender} 不匹配`);
    }

    const contract = MerkleDapp__factory.connect(contractAddress, wallet);


    const amountToSend = ethers.parseEther("0.01");

    const emptyProof: string[] = [];
    
    console.log(`准备从 ${sender} 发送 0.01 ETH 到合约 ${recipient} 并调用claim函数`);
    
    const txResponse = await contract.claim.staticCall(emptyProof, {
      value: amountToSend
    });
    
    const tx = await contract.claim(emptyProof, {
      value: amountToSend
    });
    
    console.log(`交易已提交，交易哈希: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`交易已确认，区块号: ${receipt?.blockNumber}`);
    console.log(`交易成功完成！`);
  } catch (error) {
    console.error("调用合约并发送ETH时出错:", error);
  }
}

main(); 