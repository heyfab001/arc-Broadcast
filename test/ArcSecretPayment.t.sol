// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/ArcSecretPayment.sol";
import "./MockUSDC.sol";

interface VmCheatCodes {
    function prank(address) external;
    function warp(uint256) external;
    function expectRevert(bytes calldata) external;
    function expectEmit(bool, bool, bool, bool) external;
}

contract ArcSecretPaymentTest {
    VmCheatCodes private constant vm = VmCheatCodes(address(uint160(uint256(keccak256("hevm cheat code")))));

    ArcSecretPayment public secretPaymentContract;
    MockUSDC public usdc;

    address public sender = address(0x5E4DE);
    address public receiver = address(0x4EC41);
    address public hacker = address(0xBAD);

    bytes32 public claimId = keccak256("arc-claim-001");
    bytes public rawSecret = bytes("arc_super_secret_preimage_123");
    bytes32 public secretHash;
    uint256 public depositAmount = 50 * 10**6; // 50 USDC
    uint256 public expiryTimestamp;

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

    function setUp() public {
        secretPaymentContract = new ArcSecretPayment();
        usdc = new MockUSDC();

        secretHash = keccak256(rawSecret);
        expiryTimestamp = block.timestamp + 7 days;

        // Mint 100,000 USDC to sender
        usdc.mint(sender, 100_000 * 10**6);

        // Approve secret payment contract
        vm.prank(sender);
        usdc.approve(address(secretPaymentContract), type(uint256).max);
    }

    // 1. Create claim
    function test_CreateClaim() public {
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );

        ArcSecretPayment.Claim memory c = secretPaymentContract.getClaim(claimId);
        assert(c.sender == sender);
        assert(c.token == address(usdc));
        assert(c.amount == depositAmount);
        assert(c.secretHash == secretHash);
        assert(c.expiry == expiryTimestamp);
        assert(c.claimed == false);
        assert(c.refunded == false);
        assert(usdc.balanceOf(address(secretPaymentContract)) == depositAmount);
    }

    // 2. Claim successfully with correct secret & 12. Correct USDC amount reaches receiver
    function test_ClaimSuccessfully() public {
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );

        uint256 receiverBefore = usdc.balanceOf(receiver);

        vm.prank(receiver);
        secretPaymentContract.claim(claimId, rawSecret);

        assert(usdc.balanceOf(receiver) - receiverBefore == depositAmount);
        assert(usdc.balanceOf(address(secretPaymentContract)) == 0);

        ArcSecretPayment.Claim memory c = secretPaymentContract.getClaim(claimId);
        assert(c.claimed == true);
        assert(c.claimedBy == receiver);
    }

    // 3. Cannot claim twice
    function test_RevertWhen_ClaimTwice() public {
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );

        vm.prank(receiver);
        secretPaymentContract.claim(claimId, rawSecret);

        vm.expectRevert(abi.encodeWithSelector(ArcSecretPayment.AlreadyClaimed.selector, claimId));
        vm.prank(receiver);
        secretPaymentContract.claim(claimId, rawSecret);
    }

    // 4. Wrong secret fails
    function test_RevertWhen_WrongSecret() public {
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );

        bytes memory wrongSecret = bytes("wrong_secret_guess");
        vm.expectRevert(abi.encodeWithSelector(ArcSecretPayment.InvalidSecret.selector, claimId));
        vm.prank(hacker);
        secretPaymentContract.claim(claimId, wrongSecret);
    }

    // 5. Expired claim cannot be claimed
    function test_RevertWhen_ClaimAfterExpiry() public {
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );

        // Warp past expiry
        vm.warp(expiryTimestamp + 1);

        vm.expectRevert(abi.encodeWithSelector(ArcSecretPayment.ClaimExpired.selector, claimId, expiryTimestamp, expiryTimestamp + 1));
        vm.prank(receiver);
        secretPaymentContract.claim(claimId, rawSecret);
    }

    // 6. Sender can refund after expiry & 13. Sender receives refund after expiry
    function test_SenderRefundAfterExpiry() public {
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );

        // Warp past expiry
        vm.warp(expiryTimestamp + 1);

        uint256 senderBefore = usdc.balanceOf(sender);

        vm.prank(sender);
        secretPaymentContract.refundExpired(claimId);

        assert(usdc.balanceOf(sender) - senderBefore == depositAmount);
        assert(usdc.balanceOf(address(secretPaymentContract)) == 0);

        ArcSecretPayment.Claim memory c = secretPaymentContract.getClaim(claimId);
        assert(c.refunded == true);
    }

    // 7. Sender cannot refund before expiry
    function test_RevertWhen_RefundBeforeExpiry() public {
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(ArcSecretPayment.NotExpiredYet.selector, claimId, expiryTimestamp, block.timestamp));
        vm.prank(sender);
        secretPaymentContract.refundExpired(claimId);
    }

    // 8. Non-sender cannot refund
    function test_RevertWhen_NonSenderRefund() public {
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );

        // Warp past expiry
        vm.warp(expiryTimestamp + 1);

        vm.expectRevert(abi.encodeWithSelector(ArcSecretPayment.OnlySenderCanRefund.selector, claimId, hacker, sender));
        vm.prank(hacker);
        secretPaymentContract.refundExpired(claimId);
    }

    // 9. Zero amount fails
    function test_RevertWhen_ZeroAmount() public {
        vm.expectRevert(abi.encodeWithSelector(ArcSecretPayment.ZeroAmount.selector));
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            0,
            expiryTimestamp
        );
    }

    // 10. Invalid expiry fails
    function test_RevertWhen_InvalidExpiry() public {
        vm.expectRevert(abi.encodeWithSelector(ArcSecretPayment.InvalidExpiry.selector));
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            block.timestamp // must be > block.timestamp
        );
    }

    // 11. Duplicate claim ID fails
    function test_RevertWhen_DuplicateClaimId() public {
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(ArcSecretPayment.ClaimAlreadyExists.selector, claimId));
        vm.prank(sender);
        secretPaymentContract.createClaim(
            claimId,
            secretHash,
            address(usdc),
            depositAmount,
            expiryTimestamp
        );
    }
}
