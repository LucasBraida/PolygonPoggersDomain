import React from 'react'
import {motion} from 'framer-motion'
import {switchNetwork} from '../../utils'
import {itemVariant} from '../../constants'
const SwitchNetworkContainer = () => {
    return (
        <motion.div className="connect-wallet-container"
        variants={itemVariant}>
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
        </motion.div>
    )
}

export default SwitchNetworkContainer
