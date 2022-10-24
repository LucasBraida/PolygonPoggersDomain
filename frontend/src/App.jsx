import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { motion } from 'framer-motion'
import './styles/App.css';
import {MintsGallery, WalletHandle, ConnectWalletContainer, SwitchNetworkContainer, SendMaticModal, InputForm} from './components'
// import MintsGallery from "./components/MintsGallery/MintsGallery";
// import WalletHandle from "./components/WalletHandle/WalletHandle";
// import ConnectWalletContainer from "./components/ConnectWalletContainer/ConnectWalletContainer";
// import SwitchNetworkContainer from "./components/SwitchNetworkContainer/SwitchNetworkContainer";
// import SendMaticModal from "./components/SendMaticModal/SendMaticModal";
// import InputForm from "./components/InputForm/InputForm";
import twitterLogo from './assets/twitter-logo.svg';
import poggersIcon from './assets/poggers.png'
import prayHandsIcon from './assets/prayHands.png'
import { networks } from './utils/networks';
import { checkIfWalletIsConnected, checkCurrentNetwork, checkForWallet } from './utils'

import { CONTRACT_ADDRESS, contract_abi, usedChain, containerVariant, itemVariant } from './constants'

/*TODO
- deploy new contract and update frontend to use it
- alter css to be responsive and adeuqate to small devices
- update to use variants from constant
- clean comments
*/
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

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
	const handleCloseModal = () => setOpenModal(false)

	const galleryAvailable = (currentAccount && (network === usedChain.chainName)) && mints.length > 0

	const fetchMints = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);
				//ALTER THIS PART TO USE NEW FUNCTION THAT FETCHS NAMES AND RECORDS
				// Get all the domain names from our contract
				const names = await contract.getAllNames();

				// For each name, get the record and the address
				const mintRecords = await Promise.all(names.map(async (name) => {
					const mintRecord = await contract.records(name);
					const owner = await contract.domains(name);
					return {
						id: names.indexOf(name),
						name: name,
						record: mintRecord,
						owner: owner,
					};
				}));

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
						<p className="header-container-explanation">
							just to keep our lights on <img alt="Pray Hands Icon" className="header-container-prayIcon" src={prayHandsIcon} />)
						</p>

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
				{(!(checkForWallet()))
					&& <div>
						<h1>Get Metamask and join the fun</h1>
						<a className="footer-text"
							href="https://metamask.io/"
							target="_blank"
							rel="noreferrer">https://metamask.io/</a>
					</div>}
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
			</motion.main>
			<footer className="footer-container">
				<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
				<a className="footer-text"
					href={TWITTER_LINK}
					target="_blank"
					rel="noreferrer">
					{`built with @${TWITTER_HANDLE}`}
				</a>
			</footer>
		</div>
	);
};

export default App;

{/* <div className="App">
			<div className="container">
				<div className="header-container">
					<header>
						<div className="left">
							<p className="title">🐸 Polygon Poggers Domains</p>
							<p className="subtitle">Your immortal API on the blockchain!
								Mint a nice domain, set a cool record and even transfer some coins to other domain owner!
							</p>
							<p className="explanation">	You buy one and it's yours to trade in any NFT market, but a little part is transfered to the contract
								(just to keep our lights on 🙏)</p>
						</div>
						<div className="right">
							<WalletHandle currentAccount={currentAccount} network={network} />
						</div>
					</header>
				</div>
				{(!(checkForWallet()))
					&& <div>
						<h1>Get Metamask and join the fun</h1>
						<a className="footer-text"
							href="https://metamask.io/"
							target="_blank"
							rel="noreferrer">https://metamask.io/</a>
					</div>}
				<div className="content-container">
					{(currentAccount && network !== usedChain.chainName) && <SwitchNetworkContainer />}
				</div>

				{/*check if user is connected and in the correct network */}
			// 	{(!currentAccount && (network === usedChain.chainName)) && <ConnectWalletContainer setCurrentAccount={setCurrentAccount} />}
			// 	{galleryAvailable &&
			// 		<SendMaticModal
			// 			open={openModal}
			// 			handleOpen={handleOpenModal}
			// 			handleClose={handleCloseModal}
			// 			domain={domain}
			// 			receiverAddress={receiverAddress} />
			// 	}
			// 	{(currentAccount && (network === usedChain.chainName))
			// 		&& <motion.div className="content-container"
			// 			// variants={loadingContainerVariants}
			// 			// initial="start"
			// 			// animate="end"
			// 			//transition={{staggerChildren: 1}}
			// 			variants={container}
			// 			initial='hidden'
			// 			animate='show'
			// 		>
			// 			<InputForm
			// 				domain={domain}
			// 				setDomain={setDomain}
			// 				record={record}
			// 				setRecord={setRecord}
			// 				editing={editing}
			// 				setEditing={setEditing}
			// 				fetchMints={fetchMints} />
			// 			{/* <motion.div
			// 				variants={item}
			// 			>Testando</motion.div> */}
			// 			<motion.div variants={item}>
			// 				{galleryAvailable
			// 					&& <MintsGallery
			// 						mints={mints}
			// 						currentAccount={currentAccount}
			// 						editRecord={editRecord}
			// 						callSendMatic={callSendMatic} />}

			// 			</motion.div>
			// 			{/* {galleryAvailable
			// 				&& <MintsGallery
			// 					mints={mints}
			// 					currentAccount={currentAccount}
			// 					editRecord={editRecord}
			// 					callSendMatic={callSendMatic} />} */}
			// 		</motion.div>}

			// 	<div className="footer-container">
			// 		<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
			// 		<a className="footer-text"
			// 			href={TWITTER_LINK}
			// 			target="_blank"
			// 			rel="noreferrer">
			// 			{`built with @${TWITTER_HANDLE}`}
			// 		</a>
			// 	</div>
			// </div>
			// 				</div> */}
