# Merkle Tree 应用合约

这是一个基于Merkle Tree的智能合约应用，实现以下功能：
- 合约所有者可以修改Merkle Root
- Merkle Tree中的用户可以更新合约的latest_user属性为自己的钱包地址

## 环境准备

1. 复制`.env.example`为`.env`并填写以下信息：
   - `SEPOLIA_RPC_URL`: Sepolia测试网RPC URL
   - `PRIVATE_KEY`: 您的钱包私钥（不要带0x前缀）
   - `CONTRACT_ADDRESS`: 部署后的合约地址

## 安装依赖

```bash
npm install
```

## 编译合约

```bash
npx hardhat compile
```

## 部署合约到Sepolia测试网

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

部署成功后，将输出的合约地址复制到`.env`文件的`CONTRACT_ADDRESS`字段中。

## 更新Merkle Root

```bash
npx hardhat run scripts/updateRoot.ts --network sepolia
```

## 用户调用Claim函数

```bash
npx hardhat run scripts/claim.ts --network sepolia
```

## 合约功能

- `updateRoot(bytes32 _newRoot)`: 合约所有者更新Merkle Root
- `claim(bytes32[] calldata proof)`: Merkle Tree中的用户通过提供证明来更新latest_user
