const ethers = require("ethers");
require("dotenv").config();

/**
 * SmartCon 2022 Hacker House Solidity Challenges Solutions
 */

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//m1();
//m2();
//m3();
//m4();
//m5();
//m6();
m7();

async function m1() {
  // Setup
  const address = "0x8407C7686eA96760263ED11eC7EF059361e8CD27";
  const abi = [
    "function mintNft(uint256 oldKey, uint256 newKey) public",
    "function getValue(uint256 key) public view returns (bool)",
  ];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  for (let oldKey = 0; oldKey < Number.MAX_SAFE_INTEGER; oldKey++) {
    const isRightKey = await contract.getValue(oldKey);
    if (isRightKey) {
      console.log(`Key found: ${oldKey}`);
      const newKey = ethers.BigNumber.from(Math.floor(Math.random() * 100));
      const tx = await signedContract.mintNft(oldKey, newKey);

      // Completion
      console.log(await tx.wait());
      console.log(`New key: ${newKey.toString()}`);
      console.log(`M1 completed in transaction ${tx.hash}`);
      break;
    }
  }
}

async function m2() {
  // Setup
  const address = "0x753A9fb74057384FA295a45020FEB978B5704257";
  const abi = [
    "function mintNft(uint8 addValue, uint8 newStartingValue) public",
    "function getValue() public view returns (uint8)",
  ];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  const myValue = await contract.getValue();
  console.log(`Current value: ${myValue}`);
  const overflowForUint8 = ethers.BigNumber.from(256);
  const addValue = overflowForUint8.sub(myValue);

  const newStartingValue = ethers.BigNumber.from(
    Math.floor(Math.random() * 255)
  );

  const tx = await signedContract.mintNft(addValue, newStartingValue);

  // Completion
  console.log(await tx.wait());
  console.log(`New starting value: ${newStartingValue.toString()}`);
  console.log(`M2 completed in transaction ${tx.hash}`);
}

async function m3() {
  // Setup
  const address = "0xbF8d39024277C9aC32bc641aC955770f4a55Fd48";

  // Trigger fallback function
  const tx = await signer.sendTransaction({ to: address });

  console.log(await tx.wait());
  console.log(`M3 completed in transaction ${tx.hash}`);
}

async function m4() {
  // Setup
  const address = "0x9e7d621eFf380e701E9FA9B0b87f0D994A0B85d7";

  // Trigger fallback function
  const tx = await signer.sendTransaction({ to: address });

  console.log(await tx.wait());
  console.log(`M4 completed in transaction ${tx.hash}`);
}

async function m5() {
  // Setup
  const address = "0xED51f057E0D28A60e7a139bEFacdD79ADEb94c62";
  const abi = [
    "function mintNft(uint256 valueAtStorageLocationSevenSevenSeven) public ",
  ];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  // Read what's at storage location 777, and input it here
  const valueAtStorageLocation777String = await provider.getStorageAt(
    address,
    777
  );
  const valueAtStorageLocation777 = ethers.BigNumber.from(
    valueAtStorageLocation777String
  );

  console.log(`Value at location 777 ${valueAtStorageLocation777}`);
  const tx = await signedContract.mintNft(valueAtStorageLocation777);

  // Completion
  console.log(await tx.wait());
  console.log(`M5 completed in transaction ${tx.hash}`);
}

async function m6() {
  // Setup
  const address = "0xf1a8b5dbdf8e92aa8574912d143d79504c96705e";
  const abi = ["function mintNft() public"];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  // Found the address set in the private variable was in storage location 8 by looping from 0 - 100 until a value with the length of an address appeared
  const slot8Data = await provider.getStorageAt(address, 8);
  console.log(`Data at slot 8 (ERC20 token address): ${slot8Data}`);
  const erc20TokenAddress = slot8Data.replace(
    "0x000000000000000000000000",
    "0x"
  );

  // After looking at the contract code on Etherscan
  const erc20Abi = [
    "function mintMeAToken() public",
    "function approve(address spender, uint256 amount) public returns (bool)",
  ];
  const erc20TokenContract = new ethers.Contract(
    erc20TokenAddress,
    erc20Abi,
    provider
  );
  const erc20TokenSignedContract = erc20TokenContract.connect(signer);

  // We mint the token
  const erc20MintTx = await erc20TokenSignedContract.mintMeAToken();
  console.log(await erc20MintTx.wait());
  console.log(`Token minted in transaction ${erc20MintTx.hash}`);

  const erc20ApproveTx = await erc20TokenSignedContract.approve(
    address,
    ethers.utils.parseEther("1.0")
  );
  console.log(await erc20ApproveTx.wait());
  console.log(
    `Approved original contract to spend 1 token in transaction ${erc20ApproveTx.hash}`
  );

  // Now that we have the token, we call the original smart contract
  const tx = await signedContract.mintNft();

  // Completion
  console.log(await tx.wait());
  console.log(`M6 completed in transaction ${tx.hash}`);
}

async function m7() {
  // Setup
  const address = "0x5CD7daDE9b8BD31416B5B550a67B8f79Caf3C4ba";
  const abi = ["function mint_nft(uint64 subscription_id) public"];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Requirement: You need to register a subscription at https://vrf.chain.link/ and add the contract (0x5CD7daDE9b8BD31416B5B550a67B8f79Caf3C4ba) as a consumer

  // Interaction
  const tx = await signedContract.mint_nft(
    parseInt(process.env.VRF_SUBSCRIPTION_ID)
  );

  // Completion
  console.log(await tx.wait());
  console.log(`M7 completed in transaction ${tx.hash}`);
}
