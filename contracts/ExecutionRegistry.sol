// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IntentNFT.sol";

/**
 * @title ExecutionRegistry
 * @dev Registry for tracking intent executions and executor nodes
 */
contract ExecutionRegistry is Ownable {
    IntentNFT public intentNFT;
    
    struct Execution {
        uint256 intentId;
        address executor;
        uint256 timestamp;
        bool success;
        string txHash;
        string resultData; // JSON string of execution results
    }
    
    struct ExecutorNode {
        address nodeAddress;
        string name;
        bool isActive;
        uint256 totalExecutions;
        uint256 successfulExecutions;
        uint256 registeredAt;
    }
    
    mapping(uint256 => Execution[]) public intentExecutions;
    mapping(address => ExecutorNode) public executorNodes;
    address[] public registeredExecutors;
    
    event ExecutionRecorded(
        uint256 indexed intentId,
        address indexed executor,
        uint256 timestamp,
        bool success,
        string txHash
    );
    
    event ExecutorRegistered(
        address indexed executor,
        string name,
        uint256 timestamp
    );
    
    event ExecutorStatusChanged(
        address indexed executor,
        bool isActive,
        uint256 timestamp
    );
    
    constructor(address _intentNFT) Ownable(msg.sender) {
        intentNFT = IntentNFT(_intentNFT);
    }
    
    /**
     * @dev Register a new executor node
     * @param executor Address of the executor
     * @param name Name/identifier of the executor
     */
    function registerExecutor(address executor, string memory name) public onlyOwner {
        require(!executorNodes[executor].isActive || executorNodes[executor].nodeAddress == address(0), "Executor already registered");
        
        executorNodes[executor] = ExecutorNode({
            nodeAddress: executor,
            name: name,
            isActive: true,
            totalExecutions: 0,
            successfulExecutions: 0,
            registeredAt: block.timestamp
        });
        
        registeredExecutors.push(executor);
        
        emit ExecutorRegistered(executor, name, block.timestamp);
    }
    
    /**
     * @dev Record an execution
     * @param intentId The intent NFT token ID
     * @param success Whether the execution was successful
     * @param txHash Transaction hash of the execution
     * @param resultData JSON string of execution results
     */
    function recordExecution(
        uint256 intentId,
        bool success,
        string memory txHash,
        string memory resultData
    ) public {
        require(executorNodes[msg.sender].isActive, "Executor not authorized");
        require(intentNFT.ownerOf(intentId) != address(0), "Intent does not exist");
        
        Execution memory execution = Execution({
            intentId: intentId,
            executor: msg.sender,
            timestamp: block.timestamp,
            success: success,
            txHash: txHash,
            resultData: resultData
        });
        
        intentExecutions[intentId].push(execution);
        
        executorNodes[msg.sender].totalExecutions++;
        if (success) {
            executorNodes[msg.sender].successfulExecutions++;
        }
        
        intentNFT.recordExecution(intentId);
        
        emit ExecutionRecorded(intentId, msg.sender, block.timestamp, success, txHash);
    }
    
    /**
     * @dev Get execution history for an intent
     * @param intentId The intent NFT token ID
     */
    function getExecutionHistory(uint256 intentId) public view returns (Execution[] memory) {
        return intentExecutions[intentId];
    }
    
    /**
     * @dev Get executor node info
     * @param executor Address of the executor
     */
    function getExecutorNode(address executor) public view returns (ExecutorNode memory) {
        return executorNodes[executor];
    }
    
    /**
     * @dev Set executor active status
     * @param executor Address of the executor
     * @param active New active status
     */
    function setExecutorStatus(address executor, bool active) public onlyOwner {
        require(executorNodes[executor].nodeAddress != address(0), "Executor not registered");
        executorNodes[executor].isActive = active;
        
        emit ExecutorStatusChanged(executor, active, block.timestamp);
    }
    
    /**
     * @dev Get all registered executors
     */
    function getAllExecutors() public view returns (address[] memory) {
        return registeredExecutors;
    }
}

