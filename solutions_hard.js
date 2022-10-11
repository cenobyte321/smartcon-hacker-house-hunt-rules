const ethers = require("ethers");
require("dotenv").config();

/**
 * SmartCon 2022 Hacker House Solidity Challenges Solutions
 */

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

h1();

async function h1() {
  // Couple of notes for this one:

  // 1. As of the time of writing this, the address of H1 in the Helper contract is set to 0x0.
  // Therefore, the functions won't call back the original contract and the call would go to the black hole address instead.
  // This can be checked by looking at the storage slots of the Helper contract:

  // for (let i = 0; i < 100; i++) {
  //   console.log(
  //     await provider.getStorageAt(
  //       "0x64dcf9451e8a445a9b7bc831e48c134c4faddbb6",
  //       i
  //     )
  // );
  // Or looking at the sequence of internal transactions: https://goerli.etherscan.io/address/0x64dcf9451e8a445a9b7bc831e48c134c4faddbb6#internaltx
  // Only the contract owner/creator can rectify this by setting the H1 address using the setH1(address) function.
  // The owner of the Helper contract is an EOA (Externally-Owned Account).
  // So, if 0xa951200545f7ea99f808d08ad3bb38e861c6c281 belongs to you, could you set the appropriate H1 address, please? :)

  // 2. The Helper contract has the checkValues modifier in callMeZero commented out. Therefore, s_selectorNumber will always be 0.

  // Setup
  const address = "0xeb2bC2378A86Ee12e855f91fbD46f73CC2Ed664e";
  const abi = [
    "function mintNft(bytes4 selector, address myAddress, uint256 myNumber) public",
  ];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction

  // Get the address of the Helper contract, which is at slot 8
  const slot8Data = await provider.getStorageAt(address, 8);
  console.log(`Data at slot 8 (Helper contract address): ${slot8Data}`);
  const helperAddress = slot8Data.replace("0x000000000000000000000000", "0x");
  console.log(`Helper Address: ${helperAddress}`);

  // After looking at the contract code on Etherscan
  const helperAbi = [
    "function callMeZero(uint256 someNumber, address someAddress) public",
  ];

  const interface = new ethers.utils.Interface(helperAbi);
  const methodSelector = interface.getSighash("callMeZero(uint256,address)");
  const myNumber = 70; // require(someNumber + 7 == 77, "Wrong number!");

  const tx = await signedContract.mintNft(
    methodSelector,
    signer.address,
    myNumber
  );

  // Completion
  console.log(await tx.wait());
  console.log(`H1 completed in transaction ${tx.hash}`);
}
