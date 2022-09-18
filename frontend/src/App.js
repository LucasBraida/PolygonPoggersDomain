import React, { useEffect } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

	// Gotta make sure this is async.
	const checkIfWalletIsConnected = () => {
		// First make sure we have access to window.ethereum
		const { ethereum } = window;

		if (!ethereum) {
			console.log("Make sure you have MetaMask!");
			return;
		} else {
			console.log("We have the ethereum object", ethereum);
		}
	}

	// Create a function to render if wallet is not connected yet
	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<p>
				<a href="https://giphy.com/gifs/wow-wtf-good-WCcdypx0dwswG1Gs95">via GIPHY</a>
			</p>
			<img src="https://media3.giphy.com/media/WCcdypx0dwswG1Gs95/giphy.gif?cid=790b7611f99c784cd154379700e1f16ea68f9bf13ab2f2ba&rid=giphy.gif&ct=g"></img>
			<button className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	);

	// This runs our function when the page loads.
	useEffect(() => {
		checkIfWalletIsConnected();
	}, [])

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<header>
						<div className="left">
							<p className="title">🐱‍👤 Ninja Name Service</p>
							<p className="subtitle">Your immortal API on the blockchain!</p>
						</div>
					</header>
				</div>

				{/* Add your render method here */}
				{renderNotConnectedContainer()}

				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer">
						{`built with @${TWITTER_HANDLE}`}
					</a>
				</div>
			</div>
		</div>
	);
};

export default App;