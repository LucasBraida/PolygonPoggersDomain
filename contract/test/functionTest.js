const {
    expect
} = require("chai");
const {
    ethers
} = require("hardhat");

describe("Deploy contracts", function () {
    let deployer, user, attacker;

    beforeEach(async function () {
        [deployer, user] = await ethers.getSigners();

        const domainFactory = await ethers.getContractFactory("PolygonPoggersDomains", deployer);
        this.domainContract = await domainFactory.deploy('poggers', hre.ethers.utils.parseEther('0.1'), 10, 50);

    });

    describe("Test register/mint", function () {
        it("Should mint a record", async function () {
            let txn = await this.domainContract.register("founder", {
                value: hre.ethers.utils.parseEther('0.1')
            });
            let domain = await this.domainContract.getAllNames()
            expect(domain[0].name).to.eq('founder')
            expect(domain[0].record).to.eq('')
            expect(domain[0].owner).to.eq(deployer.address)
        });

        it('Should not allow to mint an already used domain', async function () {
            let txn = await this.domainContract.register("founder", {
                value: hre.ethers.utils.parseEther('0.1')
            });
            await expect(this.domainContract.register("founder", {
                value: hre.ethers.utils.parseEther('0.1')
            })).to.be.revertedWithCustomError(
                this.domainContract,
                "AlreadyRegistered"
            );
        })

        it('Should not allow to mint a domain longer than the max size', async function () {
            await expect(this.domainContract.register("founder1111", {
                value: hre.ethers.utils.parseEther('0.1')
            })).to.be.revertedWithCustomError(
                this.domainContract,
                "InvalidName"
            );
        })

        it('Should not allow to mint a domain with empty spaces', async function () {
            await expect(this.domainContract.register("fou nder", {
                value: hre.ethers.utils.parseEther('0.1')
            })).to.be.revertedWithCustomError(
                this.domainContract,
                "DomainWithEmptySpaces"
            );
        })

        // it("Should accept withdrawals", async function () {
        //   await this.domainContract.withdraw();

        //   const deployerBalance = await this.domainContract.balanceOf(deployer.address);
        //   const userBalance = await this.domainContract.balanceOf(user.address);

        //   expect(deployerBalance).to.eq(0);
        //   expect(userBalance).to.eq(ethers.utils.parseEther("50"));
        // });

        // it("Perform Attack", async function () {
        //   console.log("");
        //   console.log("*** Before ***");
        //   console.log(`Bank's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.domainContract.address)).toString()}`);
        //   console.log(`Attacker's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address)).toString()}`);

        //   await this.attackerContract.attack({ value: ethers.utils.parseEther("10") });

        //   console.log("");
        //   console.log("*** After ***");
        //   console.log(`Bank's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.domainContract.address)).toString()}`);
        //   console.log(`Attackers's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address)).toString()}`);
        //   console.log("");

        //   expect(await ethers.provider.getBalance(this.domainContract.address)).to.eq(0);
        // });
    });

    describe("Test transfer", function () {
        it("Should update the domains mapping", async function () {
            let txn = await this.domainContract.register("founder", {
                value: hre.ethers.utils.parseEther('0.1')
            });
            let domain = await this.domainContract.getAllNames()
            console.log(domain[0])
            // console.log(this.domainContract)
            await this.domainContract.transferFrom(deployer.address,user.address,0)
            domain = await this.domainContract.getAllNames()
            console.log(domain[0])
            // expect(domain[0].name).to.eq('founder')
            // expect(domain[0].record).to.eq('')
            expect(domain[0].owner).to.eq(user.address)
        });

        
    });

    // describe("Test registerWithRecord/mint", function () {
    //     it("Should mint a domain with registerWithRecord", async function () {
    //         let txn = await this.domainContract.register("founder", {
    //             value: hre.ethers.utils.parseEther('0.1')
    //         });
    //         let domain = await this.domainContract.getAllNames()
    //         expect(domain[0].name).to.eq('founder')
    //         expect(domain[0].record).to.eq('')
    //         expect(domain[0].owner).to.eq(deployer.address)
    //     });

    //     it('Should not allow to mint an already used domain', async function () {
    //         let txn = await this.domainContract.register("founder", "I am the founder", {
    //             value: hre.ethers.utils.parseEther('0.1')
    //         });
    //         await expect(this.domainContract.register("founder", {
    //             value: hre.ethers.utils.parseEther('0.1')
    //         })).to.be.revertedWithCustomError(
    //             this.domainContract,
    //             "AlreadyRegistered"
    //         );
    //     })

    //     it('Should not allow to mint a domain longer than the max size', async function () {
    //         await expect(this.domainContract.register("founder1111", {
    //             value: hre.ethers.utils.parseEther('0.1')
    //         })).to.be.revertedWithCustomError(
    //             this.domainContract,
    //             "InvalidName"
    //         );
    //     })

    //     it('Should not allow to mint a domain with empty spaces', async function () {
    //         await expect(this.domainContract.register("fou nder", {
    //             value: hre.ethers.utils.parseEther('0.1')
    //         })).to.be.revertedWithCustomError(
    //             this.domainContract,
    //             "DomainWithEmptySpaces"
    //         );
    //     })

    //     // it("Should accept withdrawals", async function () {
    //     //   await this.domainContract.withdraw();

    //     //   const deployerBalance = await this.domainContract.balanceOf(deployer.address);
    //     //   const userBalance = await this.domainContract.balanceOf(user.address);

    //     //   expect(deployerBalance).to.eq(0);
    //     //   expect(userBalance).to.eq(ethers.utils.parseEther("50"));
    //     // });

    //     // it("Perform Attack", async function () {
    //     //   console.log("");
    //     //   console.log("*** Before ***");
    //     //   console.log(`Bank's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.domainContract.address)).toString()}`);
    //     //   console.log(`Attacker's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address)).toString()}`);

    //     //   await this.attackerContract.attack({ value: ethers.utils.parseEther("10") });

    //     //   console.log("");
    //     //   console.log("*** After ***");
    //     //   console.log(`Bank's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.domainContract.address)).toString()}`);
    //     //   console.log(`Attackers's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address)).toString()}`);
    //     //   console.log("");

    //     //   expect(await ethers.provider.getBalance(this.domainContract.address)).to.eq(0);
    //     // });
    // });
});
