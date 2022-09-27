export const connectWallet = async (ethereum, setCurrentAccount) => {
    const accounts = await ethereum.request({
        method: "eth_requestAccounts"
    });
    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]);

}
