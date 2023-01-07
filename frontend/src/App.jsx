import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { motion } from 'framer-motion'
import './styles/App.css';
import { MintsGallery, WalletHandle, ConnectWalletContainer, SwitchNetworkContainer, SendMaticModal, InputForm } from './components'
import twitterLogo from './assets/twitter-logo.svg';
import poggersIcon from './assets/poggers.png'
import { networks } from './utils/networks';
import { checkIfWalletIsConnected, checkCurrentNetwork, checkForWallet } from './utils'

import { CONTRACT_ADDRESS, contract_abi, usedChain, containerVariant, itemVariant } from './constants'


// Constants
const TWITTER_HANDLE = '_buildspace';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	const [domain, setDomain] = useState('');
	const [record, setRecord] = useState('');
	const [network, setNetwork] = useState('');
	const [editing, setEditing] = useState(false);
	const [mints, setMints] = useState([]);
	const [receiverAddress, setReceiverAddress] = useState("")
	const [openModal, setOpenModal] = useState(false)
	const handleOpenModal = () => setOpenModal(true)
	const handleCloseModal = () => {
		setDomain('')
		setOpenModal(false)
	}

	const galleryAvailable = (currentAccount && (network === usedChain.chainName)) && (mints.length > 0)
	const fetchMints = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);
				const names = await contract.getAllNames();
				const mintRecords = names.map((domain, index) => {
					return {
						id: index,
						name: domain[0],
						record: domain[1],
						owner: domain[2]
					}
				})

				console.log(names)
				console.log("MINTS FETCHED ", mintRecords);
				setMints(mintRecords);
			}
		} catch (error) {
			console.log(error);
		}
	}

	const editRecord = (name) => {
		console.log("Editing record for", name);
		setEditing(true);
		setDomain(name);
	}

	const callSendMatic = (domain, receiverAddress) => {
		setDomain(domain)
		setReceiverAddress(receiverAddress)
		handleOpenModal()
	}

	useEffect(() => {
		try {
			const { ethereum } = window
			if (!ethereum) {
				return;
			}

			checkIfWalletIsConnected(ethereum, setCurrentAccount)
			checkCurrentNetwork(ethereum, setNetwork, networks)
			ethereum.on('accountsChanged', () => {
				checkIfWalletIsConnected(ethereum, setCurrentAccount)
			});
			ethereum.on('chainChanged', () => {
				checkCurrentNetwork(ethereum, setNetwork, networks)
			});
		} catch (error) {
			console.log(error)
		}
	}, []);


	useEffect(() => {
		if (network === usedChain.chainName) {
			fetchMints();
		}
	}, [currentAccount, network]);





	return (
		<div className="App container">
			<header className="header-container">
				<div className="header-container-info">
					<p className="header-container-title">
						<img alt="Poggers logo" className="header-container-logo" src={poggersIcon} />
						Polygon Poggers Domains</p>
					<p className="subtitle">Your immortal API on the blockchain!
						Mint a nice domain, set a cool record and even transfer some coins to other domain owner!
					</p>
					<p className="explanation">You buy one and it's yours to trade in any NFT market, but a little part is transfered to the contract (
						{/* <p className="header-container-explanation">
							just to keep our lights on <img alt="Pray Hands Icon" className="header-container-prayIcon" src={prayHandsIcon} />)
						</p> */}

					</p>
				</div>
				<div className="header-container-wh">
					<WalletHandle currentAccount={currentAccount} network={network} />
				</div>
			</header>
			<motion.main className="content-container"
				variants={containerVariant}
				initial='hidden'
				animate='show'>
				{/* Check if the browser has a wallet */}
				{(!(checkForWallet()))
					? <div>
						<h1>Get Metamask and join the fun</h1>
						<a className="footer-text"
							href="https://metamask.io/"
							target="_blank"
							rel="noreferrer">https://metamask.io/</a>
					</div>
					: <>
						{currentAccount
							? <>
								{(network !== usedChain.chainName) && <SwitchNetworkContainer />}
								{(network === usedChain.chainName)
									&& <motion.div className="content-container"
										variants={containerVariant}
										initial='hidden'
										animate='show'
									>
										<InputForm
											domain={domain}
											setDomain={setDomain}
											record={record}
											setRecord={setRecord}
											editing={editing}
											setEditing={setEditing}
											fetchMints={fetchMints} />

										<motion.div variants={itemVariant}>
											{galleryAvailable
												&& <MintsGallery
													mints={mints}
													currentAccount={currentAccount}
													editRecord={editRecord}
													callSendMatic={callSendMatic} />}

										</motion.div>
										{galleryAvailable &&
											<SendMaticModal
												open={openModal}
												handleOpen={handleOpenModal}
												handleClose={handleCloseModal}
												domain={domain}
												receiverAddress={receiverAddress} />
										}

									</motion.div>}
							</>
							: <>
								<ConnectWalletContainer setCurrentAccount={setCurrentAccount} />
							</>}
					</>
				}

			</motion.main>
			<footer className="footer-container">
				<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
				<a className="footer-text"
					href='https://lucasbraida.com'
					target="_blank"
					rel="noreferrer">
					{`built by Lucas Braida with @${TWITTER_HANDLE}`}
				</a>
			</footer>
		</div>
	);
};

export default App;

