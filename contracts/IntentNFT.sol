// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IntentNFT
 * @dev ERC-721 NFT representing a Proof-of-Intent on Polygon
 */
contract IntentNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    
    struct IntentData {
        address creator;
        string intentHash; // Cryptographic hash of the intent
        string executionRules; // JSON string of execution rules
        uint256 createdAt;
        bool isActive;
        uint256 executionCount;
        address executor; // Address authorized to execute
    }
    
    mapping(uint256 => IntentData) public intents;
    mapping(address => uint256[]) public userIntents;
    
    event IntentMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string intentHash,
        uint256 timestamp
    );
    
    event IntentExecuted(
        uint256 indexed tokenId,
        address indexed executor,
        uint256 executionCount,
        uint256 timestamp
    );
    
    event IntentStatusChanged(
        uint256 indexed tokenId,
        bool isActive,
        uint256 timestamp
    );
    
    constructor() ERC721("Proof of Intent Agent", "POIA") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new Intent NFT
     * @param to Address to mint the NFT to
     * @param intentHash Cryptographic hash of the parsed intent
     * @param executionRules JSON string of execution rules
     * @param tokenURI Metadata URI for the NFT
     * @param executor Address authorized to execute this intent
     */
    function mintIntent(
        address to,
        string memory intentHash,
        string memory executionRules,
        string memory tokenURI,
        address executor
    ) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        intents[newTokenId] = IntentData({
            creator: to,
            intentHash: intentHash,
            executionRules: executionRules,
            createdAt: block.timestamp,
            isActive: true,
            executionCount: 0,
            executor: executor
        });
        
        userIntents[to].push(newTokenId);
        
        emit IntentMinted(newTokenId, to, intentHash, block.timestamp);
        
        return newTokenId;
    }
    
    /**
     * @dev Record an execution of an intent
     * @param tokenId The NFT token ID
     */
    function recordExecution(uint256 tokenId) public {
        require(_ownerOf(tokenId) != address(0), "Intent does not exist");
        require(intents[tokenId].isActive, "Intent is not active");
        require(
            msg.sender == intents[tokenId].executor || msg.sender == owner(),
            "Not authorized to execute"
        );
        
        intents[tokenId].executionCount++;
        
        emit IntentExecuted(
            tokenId,
            msg.sender,
            intents[tokenId].executionCount,
            block.timestamp
        );
    }
    
    /**
     * @dev Toggle intent active status (only owner of NFT or contract owner)
     * @param tokenId The NFT token ID
     * @param active New active status
     */
    function setIntentStatus(uint256 tokenId, bool active) public {
        require(_ownerOf(tokenId) == msg.sender || msg.sender == owner(), "Not authorized");
        intents[tokenId].isActive = active;
        
        emit IntentStatusChanged(tokenId, active, block.timestamp);
    }
    
    /**
     * @dev Get intent data
     * @param tokenId The NFT token ID
     */
    function getIntent(uint256 tokenId) public view returns (IntentData memory) {
        return intents[tokenId];
    }
    
    /**
     * @dev Get all intents for a user
     * @param user Address of the user
     */
    function getUserIntents(address user) public view returns (uint256[] memory) {
        return userIntents[user];
    }
    
    /**
     * @dev Get total number of intents minted
     */
    function totalIntents() public view returns (uint256) {
        return _tokenIds;
    }
}

