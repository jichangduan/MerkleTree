import { ethers } from "hardhat";
import { keccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";
import { MerkleDapp } from "../typechain-types";

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("请设置环境变量CONTRACT_ADDRESS");
    }

    const [signer] = await ethers.getSigners();
    const userAddress = await signer.getAddress();
    console.log("使用地址:", userAddress);

    const addresses = [
        userAddress,
        "0x1111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222"
    ];
    
    console.log("MerkleTree包含的地址:", addresses);
    
    const leaves = addresses.map(addr => keccak256(addr));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    
    const root = tree.getHexRoot();
    console.log("计算的Merkle Root:", root);
    
    const leaf = keccak256(userAddress);
    const proof = tree.getHexProof(leaf);
    
    console.log("为地址生成的证明:", proof);
    
    if (proof.length === 0) {
        throw new Error("地址不在Merkle树中");
    }

    const MerkleDappFactory = await ethers.getContractFactory("MerkleDapp");
    const app = MerkleDappFactory.attach(contractAddress) as MerkleDapp;

    const currentRoot = await app.merkleRoot();
    console.log("合约中的Merkle Root:", currentRoot);
    
    if (currentRoot !== root) {
        console.log("警告: 合约中的Merkle Root与脚本计算的不一致!");
    }

    console.log("开始调用claim函数...");
    const tx = await app.claim(proof);
    await tx.wait();

    console.log("Claim交易成功");
    console.log("交易哈希:", tx.hash);
    
    const latestUser = await app.latestUser();
    console.log("当前latestUser:", latestUser);
    
    if (latestUser.toLowerCase() === userAddress.toLowerCase()) {
        console.log("验证成功: latestUser已成功更新为当前用户地址");
    } else {
        console.log("验证失败: latestUser未更新为当前用户地址");
    }
}

main().catch((error) => {
    console.error("Claim失败:", error);
    process.exitCode = 1;
});
