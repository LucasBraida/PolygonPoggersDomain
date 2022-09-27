import { usedChain } from '../constants'
export const switchNetwork = async (ethereum) => {
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: usedChain.chainId }],
            });
        } catch (error) {
            // This error code means that the chain we want has not been added to MetaMask
            // In this case we ask the user to add it to their MetaMask
            if (error.code === 4902) {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [usedChain],
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            console.log(error);
        }

}
