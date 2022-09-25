export const handleChangedAccount = async (ethereum) => {
    ethereum.on('accountsChanged', () => {
        window.location.reload();
    });
}