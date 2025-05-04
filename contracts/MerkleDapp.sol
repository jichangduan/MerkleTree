// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MerkleDapp {
    address public owner;
    bytes32 public merkleRoot;
    address public latestUser;

    event MerkleRootUpdated(bytes32 newRoot);
    event UserClaimed(address user);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call");
        _;
    }

    // 部署时设置初始根和所有者
    constructor(bytes32 _initialRoot) {
        owner = msg.sender;
        merkleRoot = _initialRoot;
    }

    // Owner 更新 Merkle Root
    function updateRoot(bytes32 _newRoot) external onlyOwner {
        merkleRoot = _newRoot;
        emit MerkleRootUpdated(_newRoot);
    }

    // 自定义的Merkle证明验证函数
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                // 计算 keccak256(abi.encodePacked(computedHash, proofElement))
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                // 计算 keccak256(abi.encodePacked(proofElement, computedHash))
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        // 检查计算出的根是否与给定的根匹配
        return computedHash == root;
    }

    // 用户提交 proof，验证通过后写入 latestUser
    function claim(bytes32[] calldata proof) external {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(
            verify(proof, merkleRoot, leaf),
            "MerkleDapp: invalid proof"
        );
        latestUser = msg.sender;
        emit UserClaimed(msg.sender);
    }
}
