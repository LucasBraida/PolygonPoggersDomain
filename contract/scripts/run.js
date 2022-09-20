// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const Domains = await hre.ethers.getContractFactory("Domains");
  const domains = await Domains.deploy('poggers', hre.ethers.utils.parseEther('0.01'));

  await domains.deployed();
  console.log('deployed')
  const price = await domains.price();
  console.log(price)
  await domains.register("Teste", {value: hre.ethers.utils.parseEther('0.01')});
  let add = await domains.getAddress("Teste");
  console.log(add);

  // let record = await domains.connect(randomPerson).getRecord("Teste");
  // console.log("Teste record is: ",record)
  let URI = await domains.tokenURI(0)
  //console.log(URI)
  await domains.setRecord("Teste", "Owners record")
  console.log("/////////////////////////////////////////////////////////")
  URI = await domains.tokenURI(0)
  //console.log(URI)
  try {
    await domains.connect(randomPerson).register("Teste222222", {value: hre.ethers.utils.parseEther('0.01')})
    add = await domains.getAddress("Teste222222")
    console.log(add)
  } catch (error) {
    console.log(error)
  }
  console.log("/////////////////////////////////////////////////////////")
  try {
    await domains.connect(randomPerson).register("Teste");
  } catch (error) {
    console.log(error)
  }

  try {
    await domains.connect(randomPerson).setRecord("Teste", "My record now");
  } catch (error) {
    console.log(error)
  }
  // //await domains.connect(randomPerson).register("Teste");
  // await domains.connect(randomPerson).setRecord("Teste", "My record now");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
