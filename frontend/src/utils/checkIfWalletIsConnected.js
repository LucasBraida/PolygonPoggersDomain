//check for authorized accounts and sets current account
/*
@params setCurrentAccount: React State function to set current Account
*/
export const checkIfWalletIsConnected = async (ethereum, setCurrentAccount) => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // Users can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
    } else {
        console.log('No authorized account found');
    }   
};