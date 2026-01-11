pragma solidity ^0.8.20;

import "./Token.sol";

contract TokenFaucet {
    FaucetToken public token;

    uint256 public constant FAUCET_AMOUNT = 100 * 1e18;
    uint256 public constant COOLDOWN_TIME = 1 days;
    uint256 public constant MAX_CLAIM_AMOUNT = 1000 * 1e18;

    address public admin;
    bool private paused;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    event FaucetPaused(bool paused);

    constructor(address tokenAddress) {
        admin = msg.sender;
        if (tokenAddress != address(0)) {
            token = FaucetToken(tokenAddress);
        }
    }

    function setToken(address tokenAddress) external {
        require(msg.sender == admin, "Only admin");
        require(tokenAddress != address(0), "Invalid token address");
        require(address(token) == address(0), "Token already set");
        token = FaucetToken(tokenAddress);
    }

    function requestTokens() external {
        require(!paused, "Faucet is paused");
        require(address(token) != address(0), "Token not configured");

        uint256 lastClaim = lastClaimAt[msg.sender];
        uint256 claimed = totalClaimed[msg.sender];

        if (lastClaim != 0) {
            require(
                block.timestamp >= lastClaim + COOLDOWN_TIME,
                "Cooldown period not elapsed"
            );
        }

        require(
            claimed + FAUCET_AMOUNT <= MAX_CLAIM_AMOUNT,
            "Lifetime claim limit reached"
        );

        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] = claimed + FAUCET_AMOUNT;

        token.mint(msg.sender, FAUCET_AMOUNT);

        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (address(token) == address(0)) return false;
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return false;
        if (
            lastClaimAt[user] != 0 &&
            block.timestamp < lastClaimAt[user] + COOLDOWN_TIME
        ) {
            return false;
        }
        return true;
    }

    function remainingAllowance(address user) external view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return 0;
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    function setPaused(bool _paused) external {
        require(msg.sender == admin, "Only admin");
        paused = _paused;
        emit FaucetPaused(_paused);
    }

    function isPaused() external view returns (bool) {
        return paused;
    }
}
