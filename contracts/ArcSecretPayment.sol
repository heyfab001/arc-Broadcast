// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./common/ArcShared.sol";

/**
 * @title ArcSecretPayment
 * @notice Cryptographic escrow protocol for zero-knowledge payment links on Arc Testnet.
 * Senders lock tokens by committing to keccak256(secret).
 * Any receiver with the secret preimage can claim funds directly to their connected wallet.
 */
contract ArcSecretPayment is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Claim {
        address sender;
        address token;
        uint256 amount;
        bytes32 secretHash;
        uint256 expiry;
        bool claimed;
        bool refunded;
        address claimedBy;
    }

    // Mapping from unique claimId to Claim struct
    mapping(bytes32 => Claim) public claims;

    // --- Custom Errors ---
    error ZeroClaimId();
    error ZeroSecretHash();
    error ZeroTokenAddress();
    error ZeroAmount();
    error InvalidExpiry();
    error ClaimAlreadyExists(bytes32 claimId);
    error ClaimDoesNotExist(bytes32 claimId);
    error AlreadyClaimed(bytes32 claimId);
    error AlreadyRefunded(bytes32 claimId);
    error ClaimExpired(bytes32 claimId, uint256 expiry, uint256 currentTime);
    error NotExpiredYet(bytes32 claimId, uint256 expiry, uint256 currentTime);
    error InvalidSecret(bytes32 claimId);
    error OnlySenderCanRefund(bytes32 claimId, address caller, address sender);

    // --- Events ---
    event ClaimCreated(
        bytes32 indexed claimId,
        address indexed sender,
        address indexed token,
        uint256 amount,
        bytes32 secretHash,
        uint256 expiry
    );

    event Claimed(
        bytes32 indexed claimId,
        address indexed receiver,
        address indexed token,
        uint256 amount
    );

    event Refunded(
        bytes32 indexed claimId,
        address indexed sender,
        address indexed token,
        uint256 amount
    );

    /**
     * @notice Creates a new secret escrow deposit.
     * @param claimId Deterministic unique identifier for the claim.
     * @param secretHash keccak256 hash commitment of the secret preimage.
     * @param token Address of the ERC20 token to deposit (e.g. Arc USDC).
     * @param amount Amount of tokens to lock in escrow.
     * @param expiry Unix timestamp after which the claim expires and can be refunded.
     */
    function createClaim(
        bytes32 claimId,
        bytes32 secretHash,
        address token,
        uint256 amount,
        uint256 expiry
    ) external nonReentrant {
        if (claimId == bytes32(0)) revert ZeroClaimId();
        if (secretHash == bytes32(0)) revert ZeroSecretHash();
        if (token == address(0)) revert ZeroTokenAddress();
        if (amount == 0) revert ZeroAmount();
        if (expiry <= block.timestamp) revert InvalidExpiry();
        if (claims[claimId].sender != address(0)) revert ClaimAlreadyExists(claimId);

        // Lock tokens into contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Store claim
        claims[claimId] = Claim({
            sender: msg.sender,
            token: token,
            amount: amount,
            secretHash: secretHash,
            expiry: expiry,
            claimed: false,
            refunded: false,
            claimedBy: address(0)
        });

        emit ClaimCreated(claimId, msg.sender, token, amount, secretHash, expiry);
    }

    /**
     * @notice Claims locked escrow funds using the secret preimage.
     * @param claimId Unique identifier for the claim.
     * @param secret Preimage bytes whose keccak256 hash must match the stored secretHash.
     */
    function claim(bytes32 claimId, bytes calldata secret) external nonReentrant {
        Claim storage claimData = claims[claimId];

        if (claimData.sender == address(0)) revert ClaimDoesNotExist(claimId);
        if (claimData.claimed) revert AlreadyClaimed(claimId);
        if (claimData.refunded) revert AlreadyRefunded(claimId);
        if (block.timestamp > claimData.expiry) {
            revert ClaimExpired(claimId, claimData.expiry, block.timestamp);
        }
        if (keccak256(secret) != claimData.secretHash) {
            revert InvalidSecret(claimId);
        }

        // Mark claimed and record receiver
        claimData.claimed = true;
        claimData.claimedBy = msg.sender;

        // Disburse tokens to the claiming receiver's connected wallet
        IERC20(claimData.token).safeTransfer(msg.sender, claimData.amount);

        emit Claimed(claimId, msg.sender, claimData.token, claimData.amount);
    }

    /**
     * @notice Refunds expired escrow funds back to the original sender.
     * @param claimId Unique identifier for the expired claim.
     */
    function refundExpired(bytes32 claimId) external nonReentrant {
        Claim storage claimData = claims[claimId];

        if (claimData.sender == address(0)) revert ClaimDoesNotExist(claimId);
        if (claimData.claimed) revert AlreadyClaimed(claimId);
        if (claimData.refunded) revert AlreadyRefunded(claimId);
        if (block.timestamp <= claimData.expiry) {
            revert NotExpiredYet(claimId, claimData.expiry, block.timestamp);
        }
        if (msg.sender != claimData.sender) {
            revert OnlySenderCanRefund(claimId, msg.sender, claimData.sender);
        }

        // Mark refunded
        claimData.refunded = true;

        // Return tokens to the original sender
        IERC20(claimData.token).safeTransfer(claimData.sender, claimData.amount);

        emit Refunded(claimId, msg.sender, claimData.token, claimData.amount);
    }

    /**
     * @notice View function to retrieve complete details of a claim.
     */
    function getClaim(bytes32 claimId) external view returns (Claim memory) {
        return claims[claimId];
    }
}
