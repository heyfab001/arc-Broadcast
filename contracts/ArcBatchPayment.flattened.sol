// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// contracts/common/ArcShared.sol

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

/**
 * @dev Safe ERC20 transfer library helper
 */
library SafeERC20 {
    error SafeERC20FailedOperation(address token);

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        (bool success, bytes memory returndata) = address(token).call(data);
        if (!success || (returndata.length != 0 && !abi.decode(returndata, (bool)))) {
            revert SafeERC20FailedOperation(address(token));
        }
    }
}

/**
 * @dev Gas-efficient Reentrancy Guard
 */
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        if (_status == _ENTERED) revert ReentrancyGuardReentrantCall();
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

// contracts/ArcBatchPayment.sol

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
