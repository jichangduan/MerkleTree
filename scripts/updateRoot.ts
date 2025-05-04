import { ethers } from "hardhat";
import { MerkleDapp } from "../typechain-types";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "ethers";

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("请设置环境变量CONTRACT_ADDRESS");
    }

    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();
    console.log("使用签名者地址:", signerAddress);

    const addresses = [
        signerAddress,
        "0x1111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222"
    ];
    
    console.log("MerkleTree包含的地址:", addresses);
    
    const leaves = addresses.map(addr => keccak256(addr));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = tree.getHexRoot();
    
    console.log("计算的Merkle Root:", root);

    const MerkleDappFactory = await ethers.getContractFactory("MerkleDapp");
    const app = MerkleDappFactory.attach(contractAddress) as MerkleDapp;

    console.log("开始更新Merkle Root...");
    const tx = await app.updateRoot(root);
    await tx.wait();

    console.log("Merkle Root更新成功:", root);
    console.log("交易哈希:", tx.hash);
}

main().catch((error) => {
    console.error("更新Root失败:", error);
    process.exitCode = 1;
});