// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

error H2Helper__Nope();
error H2Helper__NopeCall();

interface IOtherContract {
    function getOwner() external returns (address);
}

contract H2Helper {
    uint256 public s_variable = 0;
    uint256 public s_otherVar = 0;

    function callContract(address yourAddress) public returns (bool) {
        (bool success, ) = yourAddress.delegatecall(
            abi.encodeWithSignature("doSomething()")
        );
        require(success);
        if (s_variable != 123) {
            revert H2Helper__NopeCall();
        }
        s_variable = 0;
        return true;
    }

    function callContractAgain(address yourAddress, bytes4 selector)
        public
        returns (bool)
    {
        s_otherVar = s_otherVar + 1;
        (bool success, ) = yourAddress.call(abi.encodeWithSelector(selector));
        require(success);
        if (s_otherVar == 2) {
            return true;
        }
        s_otherVar = 0;
        return false;
    }
}

contract H2 is IOtherContract {
    // These should match the storage layout of H2Helper to tamper with its storage on delegatecall.
    // For this reason we don't use OpenZeppelin's Ownable
    uint256 public s_variable;
    uint256 public s_otherVar;
    H2Helper public h2Helper;
    address private owner;

    constructor(address h2HelperAddress) {
        h2Helper = H2Helper(h2HelperAddress);
        owner = msg.sender;
    }

    function doSomething() public {
        s_variable = 123;
        s_otherVar = 1;
    }

    function doSomethingElse() public returns (bool) {
        return true;
    }

    function getOwner() external override returns (address) {
        return owner;
    }
}
