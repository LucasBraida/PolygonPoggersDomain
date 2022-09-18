import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	
	const connectWallet = async () => {
		try {
		  const { ethereum } = window;
	
		  if (!ethereum) {
			alert("Get MetaMask -> https://metamask.io/");
			return;
		  }
	
		  // Fancy method to request access to account.
		  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
		  // Boom! This should print out public address once we authorize Metamask.
		  console.log("Connected", accounts[0]);
		  setCurrentAccount(accounts[0]);
		} catch (error) {
		  console.log(error)
		}
	  }
	const checkIfWalletIsConnected = async () => {
	  const { ethereum } = window;
  
	  if (!ethereum) {
		console.log('Make sure you have metamask!');
		return;
	  } else {
		console.log('We have the ethereum object', ethereum);
	  }
  
	  // Check if we're authorized to access the user's wallet
	  const accounts = await ethereum.request({ method: 'eth_accounts' });
  
	  // Users can have multiple authorized accounts, we grab the first one if its there!
	  if (accounts.length !== 0) {
		const account = accounts[0];
		console.log('Found an authorized account:', account);
		setCurrentAccount(account);
	  } else {
		console.log('No authorized account found');
	  }
	};

	// Create a function to render if wallet is not connected yet
	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<p>
				<a href="https://giphy.com/gifs/wow-wtf-good-WCcdypx0dwswG1Gs95">via GIPHY</a>
			</p>
			<img src="https://media3.giphy.com/media/WCcdypx0dwswG1Gs95/giphy.gif?cid=790b7611f99c784cd154379700e1f16ea68f9bf13ab2f2ba&rid=giphy.gif&ct=g" alt="Poggers Gif from GIPHY"></img>
			<button className="cta-button connect-wallet-button" onClick={connectWallet}>
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