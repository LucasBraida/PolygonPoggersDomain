import React from 'react'
import {switchNetwork} from '../../utils'

const SwitchNetworkContainer = () => {
    return (
        <div className="connect-wallet-container">
            <p>Please connect to the Polygon Mumbai Testnet</p>
            <button className='cta-button mint-button' onClick={() => {
                try {
                    const { ethereum } = window;

                    if (!ethereum) {
                        alert("Get MetaMask -> https://metamask.io/");
                        return;
                    }
                    switchNetwork(ethereum)
                } catch (error) {
                    console.log(error)
            }
            }}>Click here to switch</button>
        </div>
    )
}

export default SwitchNetworkContainer