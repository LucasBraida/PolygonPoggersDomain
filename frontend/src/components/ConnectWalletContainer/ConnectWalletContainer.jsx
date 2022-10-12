import './ConnectWalletContainer.css'
import React from 'react'
import {connectWallet} from '../../utils'

const ConnectWalletContainer = ({setCurrentAccount}) => {
    console.log("I am being rendered")
  return (
    <div className="connect-wallet-container">

			<img src="https://media3.giphy.com/media/WCcdypx0dwswG1Gs95/giphy.gif?cid=&:ref-=´90b7611f99c784cd154379700e1f16ea68f9bf13ab2f2ba&rid=giphy.gif&ct=g" alt="Poggers Gif from GIPHY"></img>
			<p className='margin_bottom'>
				<a className="footer-text" href="https://giphy.com/gifs/wow-wtf-good-WCcdypx0dwswG1Gs95">via GIPHY</a>
			</p>
			<button className="cta-button connect-wallet-button" onClick={() => {
				try {
					const { ethereum } = window;

					if (!ethereum) {
						return;
					}
					connectWallet(ethereum, setCurrentAccount)
				} catch (error) {
					console.log(error)
			}}}>
				Connect Wallet
			</button>
		</div>
  )
}

export default ConnectWalletContainer
