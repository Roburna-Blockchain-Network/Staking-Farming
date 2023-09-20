const { ethers } = require("hardhat");
const hre = require("hardhat");

const receier = '0xd2AB411A9Df138A697c0330e538bc1F876F9E73B'
const max_supply = ethers.utils.parseEther('1000000000')
async function main() {

  const [deployer] = await ethers.getSigners();
  const gasPrice = await hre.ethers.provider.getGasPrice();

  /**
   * get contract factory
   */
  const Dork = await ethers.getContractFactory("DorkLord")

  const dork = await Dork.deploy(
    {
      gasPrice: gasPrice
    });
  await dork.deployed();

  try {
    await hre.run("verify:verify", {
      address: dork.address,
      contract: "contracts/DorkLord.sol:DorkLord",
      constructorArguments: [],
    });
  } catch (error) {
    console.log(error);
  }

  const tx = await dork.transfer(receier, max_supply, {
    gasPrice: gasPrice
  })

  await tx.wait()

  /**
   * console all address
   */

  console.log('dork address: ', dork.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});