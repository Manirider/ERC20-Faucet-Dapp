// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Token.sol";

/**
 * @title TokenFaucet
 * @dev Rate-limited ERC20 faucet with cooldown & lifetime limits
 */
contract TokenFaucet {
    FaucetToken public token;

    uint256 public constant FAUCET_AMOUNT = 100 * 1e18;
    uint256 public constant COOLDOWN_TIME = 1 days;
    uint256 public constant MAX_CLAIM_AMOUNT = 1000 * 1e18;

    address public admin;
    bool private paused;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Invalid token address");
        token = FaucetToken(tokenAddress);
        admin = msg.sender;
    }

    /**
     * @dev Claim faucet tokens
     */
    function requestTokens() external {
        require(!paused, "Faucet is paused");
        require(canClaim(msg.sender), "Cooldown active or limit reached");
        require(
            totalClaimed[msg.sender] + FAUCET_AMOUNT <= MAX_CLAIM_AMOUNT,
            "Lifetime limit exceeded"
        );

        // effects
        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;

        // interaction
        token.mint(msg.sender, FAUCET_AMOUNT);

        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    /**
     * @dev Check if user can claim
     */
    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return false;
        return true;
    }

    /**
     * @dev Remaining lifetime allowance
     */
    function remainingAllowance(address user) external view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return 0;
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    /**
     * @dev Pause / unpause faucet (admin only)
     */
    function setPaused(bool _paused) external {
        require(msg.sender == admin, "Only admin");
        paused = _paused;
        emit FaucetPaused(_paused);
    }

    function isPaused() external view returns (bool) {
        return paused;
    }
}
