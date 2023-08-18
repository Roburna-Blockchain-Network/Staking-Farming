// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DividendToken is ERC20("DividendToken", "DIV") {
    constructor() {
        // mint 1 million BUSD / 18 decimals
        _mint(msg.sender, 10**24);
    }
}