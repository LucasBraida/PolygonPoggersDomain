import React from 'react'
import polygonLogo from '../../assets/polygonlogo.png';
import ethLogo from '../../assets/ethlogo.png';
import './WalletHandle.css'

const WalletHandle = ({currentAccount, network}) => {
    return (
        <div className='wallet-handle'>
            <img alt="Network logo" className="logo" src={network.includes("Polygon") ? polygonLogo : ethLogo} />
            {currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p>}
        </div>
    )
}

export default WalletHandle
