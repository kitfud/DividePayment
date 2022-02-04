// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract DividePayment is PaymentSplitter {
    address[] payGroup = [
        0xa97e80DF47220afaD2D017a10b023B55FDB86293,
        0xBCaee4f6A255feB2a85bf0BF66A10EF3ce50570A
    ];

    uint256[] payOutRatio = [1, 1];
    address payable public owner;

    constructor() payable PaymentSplitter(payGroup, payOutRatio) {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyPayee() {
        require(checkIfInPayGroup() == true);
        _;
    }

    function checkIfInPayGroup() internal view returns (bool) {
        for (uint256 i = 0; i < payGroup.length; i++) {
            if (payGroup[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function testFunction() public view returns (uint256) {
        return 99;
    }

    // Function to deposit Ether into this contract.
    function deposit() public payable {}

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function getPayGroup() public view returns (address[] memory) {
        return payGroup;
    }

    //contract owner can release payments to payment group as specified
    function AdminReleaseAllPayments() public onlyOwner {
        for (uint256 i = 0; i < payGroup.length; i++) {
            try
                DividePayment(payable(address(this))).release(
                    payable(payGroup[i])
                )
            {} catch {
                continue;
            }
        }
    }

    function releaseOwedPayment() public onlyPayee {
        uint256 index;
        for (uint256 i = 0; i < payGroup.length; i++) {
            if (payGroup[i] == msg.sender) {
                index = i;
            }
        }
        DividePayment(payable(address(this))).release(payable(payGroup[index]));
    }
}
