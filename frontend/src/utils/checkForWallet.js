export const checkForWallet = () => {
    try{
        const { ethereum } = window

			if (!ethereum) {
				return false
			} else {
                return true
            }
    }catch(error){
        return false
    }
}
