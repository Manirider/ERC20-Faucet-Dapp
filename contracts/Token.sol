// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FaucetToken
 * @dev ERC20 token that can be minted ONLY by the Faucet contract
 */
contract FaucetToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 1e18;
    address public faucet;

    constructor() ERC20("Faucet Token", "FTK") Ownable(msg.sender) {}

    /**
     * @dev Set the faucet address (only owner / deployer)
     */
    function setFaucet(address _faucet) external onlyOwner {
        require(_faucet != address(0), "Invalid faucet address");
        faucet = _faucet;
    }

    /**
     * @dev Mint tokens (only callable by faucet)
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == faucet, "Only faucet can mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}
