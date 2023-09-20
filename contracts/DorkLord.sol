// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DorkLord is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000_000_000 * 10 ** 18;

    constructor() ERC20("Dork Lord", "DORKL") {
        _mint(msg.sender, MAX_SUPPLY);
    }
}
