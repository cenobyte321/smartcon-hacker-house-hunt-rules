const ethers = require("ethers");
require("dotenv").config();

/**
 * SmartCon 2022 Hacker House Solidity Challenges Solutions
 */

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//e1();
//e2();
//e3();
//e4();
//e5();
//e6();
//e7();

/**
 * E1:
 * To fetch the NFT you need to call the mintNft() function, which calls the private _mintNft() function.
 */
async function e1() {
  // Setup
  const address = "0xeD44562aD64731E4c407a34f7C181eF962dA8e89";
  const abi = ["function mintNft() public"];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  const tx = await signedContract.mintNft();

  // Completion
  console.log(await tx.wait());
  console.log(`E1 completed in transaction ${tx.hash}`);
}

async function e2() {
  // Setup
  const address = "0x79526378aF06BbD1B6Af8628D58E5f4456565BF3";
  const abi = ["function mintNft(string memory) public"];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  const tx = await signedContract.mintNft("any string");

  // Completion
  console.log(await tx.wait());
  console.log(`E2 completed in transaction ${tx.hash}`);
}

async function e3() {
  // Setup
  const address = "0x7c32eb9cc143d8cef208824e048e762e3caf4919";
  const abi = ["function mintNft(uint256 value) public"];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  const tx = await signedContract.mintNft(2);

  // Completion
  console.log(await tx.wait());
  console.log(`E3 completed in transaction ${tx.hash}`);
}

async function e4() {
  // Setup
  const address = "0x46B6c3446dc78517E61e59Ac76AB605dCCb1Dd7e";
  // bool[5] private s_booleanArray;
  const abi = [
    "function mintNft(uint256 location, uint256 newLocation) public",
    "function getBooleanArray(uint256 index) public view returns (bool)",
  ];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  for (let location = 0; location < 5; location++) {
    const locationAvailable = await contract.getBooleanArray(location);
    if (locationAvailable) {
      console.log(`Current location: ${location}`);
      const newLocation = Math.floor(Math.random() * 6);

      const tx = await signedContract.mintNft(location, newLocation);

      // Completion
      console.log(await tx.wait());
      console.log(`New location: ${newLocation}`);
      console.log(`E4 completed in transaction ${tx.hash}`);

      break;
    }
  }
}

async function e5() {
  // Setup
  const address = "0x59a9E94f3F9b874e1bB7319973AB6063E9b95380";
  const MyStruct = "(uint256 a, uint256 b, uint256 c)";

  const abi = [
    "function mintNft(uint256 valueAtA, uint256 newValueAtA) public",
    `function getStruct() public view returns (${MyStruct} memory myStruct)`,
  ];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction

  const currentStruct = await contract.getStruct();
  const currentValueAtA = currentStruct.a;
  console.log(`Current value at A: ${currentValueAtA.toString()}`);
  const newValueAtA = ethers.BigNumber.from(Math.floor(Math.random() * 600));

  const tx = await signedContract.mintNft(currentValueAtA, newValueAtA);

  // Completion
  console.log(await tx.wait());
  console.log(`New value at A: ${newValueAtA.toString()}`);
  console.log(`E5 completed in transaction ${tx.hash}`);
}

async function e6() {
  // Setup
  // https://docs.chain.link/docs/data-feeds/price-feeds/addresses/#Goerli%20Testnet
  const priceFeedAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e";
  const address = "0xD547C52FDE4E1e2C17E5d3E3a6DA87990e922711";
  const priceFeedAbi = [
    "function latestRoundData() public view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  ];
  const abi = ["function mintNft(int256 priceOfEth) public"];
  const priceFeedContract = new ethers.Contract(
    priceFeedAddress,
    priceFeedAbi,
    provider
  );
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  const latestRoudData = await priceFeedContract.latestRoundData();
  const ethPrice = latestRoudData.answer;
  console.log(`Current ETH price in USD in Görli: ${ethPrice}`);

  const tx = await signedContract.mintNft(ethPrice);

  // Completion
  console.log(await tx.wait());
  console.log(`E6 completed in transaction ${tx.hash}`);
}

async function e7() {
  // Setup
  const address = "0xf9Fce2937a71E83EBe43dfbc726B6212c9EB6106";
  const abi = [
    "function mintNft(uint256 key) public",
    "function getMappingValue(uint256 key) public view returns (bool)",
  ];
  const contract = new ethers.Contract(address, abi, provider);
  const signedContract = contract.connect(signer);

  // Interaction
  for (let key = 0; key < Number.MAX_SAFE_INTEGER; key++) {
    const keyTaken = await contract.getMappingValue(key);
    if (!keyTaken) {
      const tx = await signedContract.mintNft(key);

      // Completion
      console.log(await tx.wait());
      console.log(`Key ${key} taken`);
      console.log(`E7 completed in transaction ${tx.hash}`);
      break;
    }
  }
}
