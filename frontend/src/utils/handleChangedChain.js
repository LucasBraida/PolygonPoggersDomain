export const handleChangedChain = async (ethereum) => {
    ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}