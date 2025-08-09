// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PronounsLiskDemo is ERC20 {
    uint constant inital_token_supply = 10000 * (10 ** 18);
    constructor(string memory tokenName, string memory tokenSymbol) ERC20(tokenName, tokenSymbol) {
        _mint(msg.sender, inital_token_supply);
    }
}
