// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/ArcSecretPayment.sol";

interface ScriptVm {
    function startBroadcast() external;
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function envUint(string calldata) external returns (uint256);
}

/**
 * @title DeployArcSecretPayment
 * @notice Foundry deployment script for ArcSecretPayment on Arc Testnet
 */
contract DeployArcSecretPayment {
    ScriptVm private constant vm = ScriptVm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function run() external returns (ArcSecretPayment secretPayment) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        secretPayment = new ArcSecretPayment();

        vm.stopBroadcast();
    }
}
