// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract M8 is Ownable {
    function mintMe(uint256 param) public returns (bytes8) {
        return 0x536d617274436f6e;
    }
}
