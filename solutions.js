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

e4();

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

  for (let location = 0; location < 5; location++) {
    const locationAvailable = await contract.getBooleanArray(location);
    if (locationAvailable) {
      const newLocation = Math.floor(Math.random() * 6);

      // Interaction
      const tx = await signedContract.mintNft(location, newLocation);

      // Completion
      console.log(`New location: ${newLocation}`);
      console.log(await tx.wait());
      console.log(`E4 completed in transaction ${tx.hash}`);

      break;
    }
  }
}
