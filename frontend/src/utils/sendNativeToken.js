import {ethers} from 'ethers'



export const sendNativeToken = async (receiver, value) => {
    try {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const tx = await signer.sendTransaction({
                to: receiver,
                value: ethers.utils.parseEther(value)
            })


            const receipt = await tx.wait();

            // Check if the transaction was successfully completed
            if (receipt.status === 1) {
                console.log("Sucessfull transaction! https://mumbai.polygonscan.com/tx/" + tx.hash);
                return true
            } else {
                alert("Transaction failed! Please try again");
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }

}
