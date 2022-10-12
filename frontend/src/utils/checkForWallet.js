export const checkForWallet = () => {
    try{
        const { ethereum } = window

			if (!ethereum) {
				//alert("Get MetaMask -> https://metamask.io/");
				return false
			} else {
                return true
            }
    }catch(error){
        return false
    }
}
