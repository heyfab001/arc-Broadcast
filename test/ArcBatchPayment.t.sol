// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/ArcBatchPayment.sol";
import "./MockUSDC.sol";

interface Vm {
    function prank(address) external;
    function expectRevert(bytes calldata) external;
    function expectEmit(bool, bool, bool, bool) external;
}

contract ArcBatchPaymentTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    ArcBatchPayment public batchContract;
    MockUSDC public usdc;

    address public sender = address(0xA11CE);
    address public recipient1 = address(0xB0B1);
    address public recipient2 = address(0xB0B2);
    address public recipient3 = address(0xB0B3);

    event BatchTransfer(
        address indexed sender,
        address indexed token,
        uint256 recipientCount,
        uint256 totalAmount,
        bytes32 indexed batchId
    );

    function setUp() public {
        batchContract = new ArcBatchPayment();
        usdc = new MockUSDC();

        // Mint 100,000 USDC to sender
        usdc.mint(sender, 100_000 * 10**6);

        // Approve batch contract
        vm.prank(sender);
        usdc.approve(address(batchContract), type(uint256).max);
    }

    // 1. One recipient works
    function test_SingleRecipientTransfer() public {
        address[] memory recipients = new address[](1);
        recipients[0] = recipient1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 50 * 10**6; // 50 USDC

        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);

        assert(usdc.balanceOf(recipient1) == 50 * 10**6);
        assert(usdc.balanceOf(sender) == (100_000 - 50) * 10**6);
    }

    // 2. Multiple recipients work
    function test_MultipleRecipientsTransfer() public {
        address[] memory recipients = new address[](3);
        recipients[0] = recipient1;
        recipients[1] = recipient2;
        recipients[2] = recipient3;

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 10 * 10**6;
        amounts[1] = 20 * 10**6;
        amounts[2] = 30 * 10**6;

        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);

        assert(usdc.balanceOf(recipient1) == 10 * 10**6);
        assert(usdc.balanceOf(recipient2) == 20 * 10**6);
        assert(usdc.balanceOf(recipient3) == 30 * 10**6);
        assert(usdc.balanceOf(address(batchContract)) == 0);
    }

    // 3. 100 recipients work
    function test_Max100RecipientsTransfer() public {
        address[] memory recipients = new address[](100);
        uint256[] memory amounts = new uint256[](100);

        for (uint256 i = 0; i < 100; i++) {
            recipients[i] = address(uint160(0x1000 + i));
            amounts[i] = 1 * 10**6; // 1 USDC each
        }

        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);

        for (uint256 i = 0; i < 100; i++) {
            assert(usdc.balanceOf(recipients[i]) == 1 * 10**6);
        }
        assert(usdc.balanceOf(address(batchContract)) == 0);
    }

    // 4. 101 recipients revert
    function test_RevertWhen_Exceeds100Recipients() public {
        address[] memory recipients = new address[](101);
        uint256[] memory amounts = new uint256[](101);

        for (uint256 i = 0; i < 101; i++) {
            recipients[i] = address(uint160(0x2000 + i));
            amounts[i] = 1 * 10**6;
        }

        vm.expectRevert(abi.encodeWithSelector(ArcBatchPayment.InvalidRecipientCount.selector, 101));
        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);
    }

    // 5. Empty recipients revert
    function test_RevertWhen_EmptyRecipients() public {
        address[] memory recipients = new address[](0);
        uint256[] memory amounts = new uint256[](0);

        vm.expectRevert(abi.encodeWithSelector(ArcBatchPayment.InvalidRecipientCount.selector, 0));
        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);
    }

    // 6. Mismatched arrays revert
    function test_RevertWhen_ArrayLengthMismatch() public {
        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 10 * 10**6;

        vm.expectRevert(abi.encodeWithSelector(ArcBatchPayment.ArrayLengthMismatch.selector, 2, 1));
        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);
    }

    // 7. Zero address recipient reverts
    function test_RevertWhen_ZeroAddressRecipient() public {
        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = address(0);

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 10 * 10**6;
        amounts[1] = 10 * 10**6;

        vm.expectRevert(abi.encodeWithSelector(ArcBatchPayment.ZeroAddressRecipient.selector, 1));
        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);
    }

    // 8. Zero amount reverts
    function test_RevertWhen_ZeroAmount() public {
        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 10 * 10**6;
        amounts[1] = 0;

        vm.expectRevert(abi.encodeWithSelector(ArcBatchPayment.ZeroAmount.selector, 1));
        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);
    }

    // 9. Total transferred amount is correct & contract does not retain funds
    function test_TotalAmountTransferredExact() public {
        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1500 * 10**6;
        amounts[1] = 3500 * 10**6;

        uint256 total = 5000 * 10**6;

        uint256 senderBefore = usdc.balanceOf(sender);
        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);
        uint256 senderAfter = usdc.balanceOf(sender);

        assert(senderBefore - senderAfter == total);
        assert(usdc.balanceOf(address(batchContract)) == 0);
    }

    // 10. BatchTransfer event is emitted
    function test_EmitsBatchTransferEvent() public {
        address[] memory recipients = new address[](1);
        recipients[0] = recipient1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 25 * 10**6;

        vm.expectEmit(true, true, false, false);
        emit BatchTransfer(sender, address(usdc), 1, 25 * 10**6, bytes32(0));

        vm.prank(sender);
        batchContract.batchTransfer(address(usdc), recipients, amounts);
    }
}
