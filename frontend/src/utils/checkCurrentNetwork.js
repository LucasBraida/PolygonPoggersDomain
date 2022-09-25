export const checkCurrentNetwork = async (ethereum, setNetwork, networks) =>{
    // const { ethereum } = window;
    const chainId = await ethereum.request({ method: 'eth_chainId' });
	setNetwork(networks[chainId]);
}