const ethers = require("ethers");
require("dotenv").config();

/**
 * SmartCon 2022 Hacker House Solidity Challenges Solutions
 */

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//h1();
//h2();
h3();

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
  //   );
  // }
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

async function h2() {
  // Setup
  const address = "0x35182E3182B08fe968B2619f6eE161Cd5f5CeFb1";
  const abi = ["function mintNft(address yourAddress, bytes4 selector) public"];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  const externalAddress = process.env.H2_CONTRACT_ADDRESS;
  const externalAbi = ["function doSomethingElse() public"];
  const externalInterface = new ethers.utils.Interface(externalAbi);
  const externalMethodSelector =
    externalInterface.getSighash("doSomethingElse()");

  // Interaction

  // Get Helper Address
  const slot8Data = await provider.getStorageAt(address, 8);
  console.log(`Data at slot 8 (Helper contract address): ${slot8Data}`);
  const helperAddress = slot8Data.replace("0x000000000000000000000000", "0x");
  console.log(`Helper Address: ${helperAddress}`);

  const tx = await signedContract.mintNft(
    externalAddress,
    externalMethodSelector
  );

  // Completion
  console.log(await tx.wait());
  console.log(`H2 completed in transaction ${tx.hash}`);
}

async function h3() {
  // Setup
  const address = "0xDA47cAdADC4B7ab574085D83cE1Ed9a375DdB743";
  const abi = ["function mintNft(bytes4 selector) public "];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction

  // Get Helper Address
  const slot8Data = await provider.getStorageAt(address, 8);
  console.log(`Data at slot 8 (Helper contract address): ${slot8Data}`);
  const helperAddress = slot8Data.replace("0x000000000000000000000000", "0x");
  console.log(`Helper Address: ${helperAddress}`);

  // Helper can be decompiled in Etherscan which leave us with this:
  // # Palkeoramix decompiler.

  // def storage:
  //   stor0 is uint256 at storage 0

  // def unknowne18d4afd() payable:
  //   require not stor0
  //   stor0 = 1
  //   return 7

  // def getNumberOne() payable:
  //   require 1 == stor0
  //   stor0 = 2
  //   return 7

  // def getNumberTwo() payable:
  //   require 2 == stor0
  //   stor0 = 3
  //   return 7

  // def getNumberThree() payable:
  //   require 3 == stor0
  //   stor0 = 0
  //   return 7

  // def _fallback() payable: # default function
  //   require not stor0
  //   stor0 = 1
  //   return 7

  // We can then write an ABI out of it:

  const helperAbi = [
    "function getNumberOne() payable",
    "function getNumberTwo() payable",
    "function getNumberThree() payable",
  ];

  const interface = new ethers.utils.Interface(helperAbi);

  // Since stor0's value can shift around depending on the state it was left. We need to verify it's value first.
  // The decompiled bytecode shows that stor0 is located at slot 0
  const currentValue = parseInt(await provider.getStorageAt(helperAddress, 0));

  console.log(`Current value: ${currentValue}`);

  if (currentValue === 0) {
    // Set stor0 value to 1 by calling the fallback function
    const fallBackTx = await signer.sendTransaction({ to: helperAddress });
    console.log(await fallBackTx.wait());
    currentValue = 1;
  }

  let methodSelector = "";
  switch (currentValue) {
    case 1:
      methodSelector = interface.getSighash("getNumberOne()");
      console.log("Calling getNumberOne()");
      break;
    case 2:
      methodSelector = interface.getSighash("getNumberTwo()");
      console.log("Calling getNumberTwo()");
      break;
    case 3:
      methodSelector = interface.getSighash("getNumberThree()");
      console.log("Calling getNumberThree()");
      break;
    default:
      console.error("Unexpected value!");
      break;
  }

  const tx = await signedContract.mintNft(methodSelector);

  // Completion
  console.log(await tx.wait());
  console.log(`H3 completed in transaction ${tx.hash}`);
}
