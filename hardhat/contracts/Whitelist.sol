// SPDX-License-Identifier: MIT
pragma solidity^0.8.0;
//0xE789B7719387fD6B35c6aD4Dfd65B8f8E0909D70
contract Whitelist {

    uint8 public maxWhitelistedAddresses;

    mapping (address => bool) public whitelistedAddresses;

    uint8 public numAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        require(!whitelistedAddresses[msg.sender], "Address is already whitelisted");
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "Limit has reached & more addresses can;t be whitelisted");
        numAddressesWhitelisted += 1;
        whitelistedAddresses[msg.sender] = true;
    }
}