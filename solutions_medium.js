const ethers = require("ethers");
require("dotenv").config();

/**
 * SmartCon 2022 Hacker House Solidity Challenges Solutions
 */

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//m1();

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
