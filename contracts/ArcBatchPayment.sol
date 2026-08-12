// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./common/ArcShared.sol";

/**
 * @title ArcBatchPayment
 * @notice High-throughput, gas-optimized batch payment processor on Arc Testnet.
 * Disburses ERC-20 tokens (e.g. Arc USDC) to up to 100 recipients atomically.
 */
contract ArcBatchPayment is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Minimum and maximum recipients per batch
    uint256 public constant MIN_RECIPIENTS = 1;
    uint256 public constant MAX_RECIPIENTS = 100;

    // --- Custom Errors ---
    error InvalidRecipientCount(uint256 count);
    error ArrayLengthMismatch(uint256 recipientsLength, uint256 amountsLength);
    error ZeroAddressRecipient(uint256 index);
    error ZeroAddressToken();
    error ZeroAmount(uint256 index);

    // --- Events ---
    event BatchTransfer(
        address indexed sender,
        address indexed token,
        uint256 recipientCount,
        uint256 totalAmount,
        bytes32 indexed batchId
    );

    event SingleRecipientTransfer(
        bytes32 indexed batchId,
        address indexed recipient,
        uint256 amount
    );

    /**
     * @notice Executes atomic batch transfer of ERC-20 tokens to 1-100 recipients.
     * @param token Address of the ERC-20 token contract.
     * @param recipients Array of recipient wallet addresses.
     * @param amounts Array of token amounts to send to each recipient.
     */
    function batchTransfer(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant {
        uint256 recipientCount = recipients.length;

        // Bounds check: 1 to 100 recipients
        if (recipientCount < MIN_RECIPIENTS || recipientCount > MAX_RECIPIENTS) {
            revert InvalidRecipientCount(recipientCount);
        }

        // Array length parity check
        if (recipientCount != amounts.length) {
            revert ArrayLengthMismatch(recipientCount, amounts.length);
        }

        // Token zero address check
        if (token == address(0)) {
            revert ZeroAddressToken();
        }

        // Calculate total amount and validate inputs
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < recipientCount; ) {
            address recipient = recipients[i];
            uint256 amount = amounts[i];

            if (recipient == address(0)) {
                revert ZeroAddressRecipient(i);
            }
            if (amount == 0) {
                revert ZeroAmount(i);
            }

            totalAmount += amount;

            unchecked {
                ++i;
            }
        }

        bytes32 batchId = keccak256(
            abi.encodePacked(msg.sender, token, block.timestamp, recipientCount, totalAmount)
        );

        // Pull total amount from sender into this contract atomically
        IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);

        // Distribute to all recipients
        for (uint256 i = 0; i < recipientCount; ) {
            IERC20(token).safeTransfer(recipients[i], amounts[i]);
            emit SingleRecipientTransfer(batchId, recipients[i], amounts[i]);

            unchecked {
                ++i;
            }
        }

        emit BatchTransfer(msg.sender, token, recipientCount, totalAmount, batchId);
    }
}
