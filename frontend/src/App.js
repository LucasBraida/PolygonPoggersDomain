import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, contract_abi } from './constants'
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = '.poggers';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [domain, setDomain] = useState('');
	const [record, setRecord] = useState('');
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
				<a className="footer-text" href="https://giphy.com/gifs/wow-wtf-good-WCcdypx0dwswG1Gs95">via GIPHY</a>
			</p>
			<img src="https://media3.giphy.com/media/WCcdypx0dwswG1Gs95/giphy.gif?cid=790b7611f99c784cd154379700e1f16ea68f9bf13ab2f2ba&rid=giphy.gif&ct=g" alt="Poggers Gif from GIPHY"></img>
			<button className="cta-button connect-wallet-button" onClick={connectWallet}>
				Connect Wallet
			</button>
		</div>
	);
	// Form to enter domain name and data
	const renderInputForm = () => {
		return (
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={domain}
						placeholder='domain'
						onChange={e => setDomain(e.target.value)}
					/>
					<p className='tld'> {tld} </p>
				</div>

				<input
					type="text"
					value={record}
					placeholder='record'
					onChange={e => setRecord(e.target.value)}
				/>

				<div className="button-container">
					<button className='cta-button mint-button' onClick={mintDomain}>
						Mint
					</button>
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Set data
					</button>
				</div>

			</div>
		);
	}

	const mintDomain = async () => {
		// Don't run if the domain is empty
		if (!domain) { return }
		// add avilability check when it's set in the contract
		//add getPrice from contract
		const price = "0.1";
		console.log("Minting domain", domain, "with price", price);
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);
				console.log("Going to pop wallet now to pay gas...")
				let tx = await contract.register(domain, { value: ethers.utils.parseEther(price) });
				// Wait for the transaction to be mined
				const receipt = await tx.wait();

				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);

					// Set the record for the domain
					tx = await contract.setRecord(domain, record);
					await tx.wait();

					console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

					setRecord('');
					setDomain('');
				}
				else {
					alert("Transaction failed! Please try again");
				}
			}
		}
		catch (error) {
			console.log(error);
		}
	}

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
							<p className="title">🐸 Polygon Poggers Domains</p>
							<p className="subtitle">Your immortal API on the blockchain!</p>
						</div>
					</header>
				</div>

				{!currentAccount && renderNotConnectedContainer()}
				{/* Render the input form if an account is connected */}
				{currentAccount && renderInputForm()}

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
