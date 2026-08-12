// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/ArcBatchPayment.sol";

interface ScriptVm {
    function startBroadcast() external;
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function envUint(string calldata) external returns (uint256);
}

/**
 * @title DeployArcBatchPayment
 * @notice Foundry deployment script for ArcBatchPayment on Arc Testnet
 */
contract DeployArcBatchPayment {
    ScriptVm private constant vm = ScriptVm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function run() external returns (ArcBatchPayment batchPayment) {
        // Reads private key from environment variable (never hardcoded)
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        batchPayment = new ArcBatchPayment();

        vm.stopBroadcast();
    }
}
