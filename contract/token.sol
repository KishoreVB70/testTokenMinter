// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract  testToken is ERC20("Test Token", "TT"){
    function mint(uint256 _amount) public{
        _mint(msg.sender, _amount);
    }
}
