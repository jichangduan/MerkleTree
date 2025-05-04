import { ethers } from "hardhat";

async function main() {
    const MerkleDapp = await ethers.getContractFactory("MerkleDapp");

    const root = ethers.ZeroHash;

    console.log("开始部署MerkleDapp合约...");
    
    const app = await MerkleDapp.deploy(root);
    await app.waitForDeployment();

    const contractAddress = await app.getAddress();
    console.log("MerkleDapp部署成功，地址:", contractAddress);
    
    console.log("部署交易哈希:", app.deploymentTransaction()?.hash);
}

main();