const main = async () => {
    const domainContractFactory = await hre.ethers.getContractFactory('PolygonPoggersDomains');
    const domainContract = await domainContractFactory.deploy('poggers', hre.ethers.utils.parseEther('0.1'), 10, 50);
    await domainContract.deployed();
  
    console.log("Contract deployed to:", domainContract.address);
  
    let txn = await domainContract.registerWithRecord("founder", "Being a founder is soooo poggers!!", {value: hre.ethers.utils.parseEther('0.1')});
    await txn.wait();
    console.log("Minted domain founder.poggers");
  
  
    const address = await domainContract.getAddress("founder");
    console.log("Owner of domain founder:", address);
  
    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
  }
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();