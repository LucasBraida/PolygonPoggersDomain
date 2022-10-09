import React, { useEffect, useState } from "react";
import './styles/App.css';
import MintsGallery from "./components/MintsGallery/MintsGallery";
import WalletHandle from "./components/WalletHandle/WalletHandle";
import ConnectWalletContainer from "./components/ConnectWalletContainer/ConnectWalletContainer";
import SwitchNetworkContainer from "./components/SwitchNetworkContainer/SwitchNetworkContainer";
import SendEthModal from "./components/SendEthModal/SendEthModal";
import ThreeDotsWave from "./components/ThreeDotsWave/ThreeDotsWave";
import InputForm from "./components/InputForm/InputForm";
import twitterLogo from './assets/twitter-logo.svg';
import { networks } from './utils/networks';
import { connectWallet, checkIfWalletIsConnected, checkCurrentNetwork, handleChangedAccount, handleChangedChain, switchNetwork, sendNativeToken } from './utils'
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, contract_abi, usedChain, tld } from './constants'

/*TODO
- alter css to be responsive and adeuqate to small devices
- add loading animaion during fetching ?
- add framer motion
- add SendEth/sendMATIC to transfer using the resolved names from the domain
- add loading animation to send eth
- add tld to send MATIC modal
- add underline send MATica domain
- rename send eth to send matic
- alter send matica icon to cash symbol
- check hover css to edit and cash icon
- add address to domain UI information
*/
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
//const tld = '.poggers';
// const usedChain = {
// 	chainId: '0x13881',
// 	chainName: 'Polygon Mumbai Testnet',
// 	rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
// 	nativeCurrency: {
// 		name: "Mumbai Matic",
// 		symbol: "MATIC",
// 		decimals: 18
// 	},
// 	blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
// }
/*chainId: '0x13881',
								   chainName: 'Polygon Mumbai Testnet',
								   rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
								   nativeCurrency: {
									   name: "Mumbai Matic",
									   symbol: "MATIC",
									   decimals: 18
								   },
								   blockExplorerUrls: ["https://mumbai.polygonscan.com/"] */

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
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);

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

	// const updateDomain = async () => {
	// 	if (!record || !domain) { return }
	// 	setLoading(true);
	// 	console.log("Updating domain", domain, "with record", record);
	// 	try {
	// 		const { ethereum } = window;
	// 		if (ethereum) {
	// 			const provider = new ethers.providers.Web3Provider(ethereum);
	// 			const signer = provider.getSigner();
	// 			const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);

	// 			let tx = await contract.setRecord(domain, record);
	// 			await tx.wait();
	// 			console.log("Record set https://mumbai.polygonscan.com/tx/" + tx.hash);

	// 			await fetchMints();
	// 			setRecord('');
	// 			setDomain('');
	// 			setEditing(false);
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// 	setLoading(false);
	// }
	// const mintDomain = async () => {
	// 	// Don't run if the domain is empty
	// 	if (!domain) { return }
	// 	// add avilability check when it's set in the contract
	// 	//add getPrice from contract
	// 	const price = "0.1";
	// 	console.log("Minting domain", domain, "with price", price);
	// 	try {
	// 		const { ethereum } = window;
	// 		if (ethereum) {
	// 			setLoading(true)
	// 			const provider = new ethers.providers.Web3Provider(ethereum);
	// 			const signer = provider.getSigner();
	// 			const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);
	// 			console.log("Going to pop wallet now to pay gas...")
	// 			const validSize = await contract.validDomainSize(domain);
	// 			if (validSize) {
	// 				let tx = await contract.register(domain, { value: ethers.utils.parseEther(price) });
	// 				// Wait for the transaction to be mined
	// 				const receipt = await tx.wait();

	// 				// Check if the transaction was successfully completed
	// 				if (receipt.status === 1) {
	// 					console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);

	// 					// Set the record for the domain
	// 					tx = await contract.setRecord(domain, record);
	// 					await tx.wait();

	// 					console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

	// 					// Call fetchMints after 2 seconds
	// 					setTimeout(() => {
	// 						fetchMints();
	// 					}, 2000);

	// 					setRecord('');
	// 					setDomain('');
	// 				}
	// 				else {
	// 					alert("Transaction failed! Please try again");
	// 				}
	// 			}
	// 			setLoading(false)

	// 		}
	// 	}
	// 	catch (error) {
	// 		setLoading(false)
	// 		console.log(error);
	// 	}
	// }
	// // Create a function to render if wallet is not connected yet
	// const renderNotConnectedContainer = () => (
	// 	<div className="connect-wallet-container">
	// 		<p>
	// 			<a className="footer-text" href="https://giphy.com/gifs/wow-wtf-good-WCcdypx0dwswG1Gs95">via GIPHY</a>
	// 		</p>
	// 		<img src="https://media3.giphy.com/media/WCcdypx0dwswG1Gs95/giphy.gif?cid=&:ref-=´90b7611f99c784cd154379700e1f16ea68f9bf13ab2f2ba&rid=giphy.gif&ct=g" alt="Poggers Gif from GIPHY"></img>
	// 		<button className="cta-button connect-wallet-button" onClick={() => {
	// 			try {
	// 				const { ethereum } = window;

	// 				if (!ethereum) {
	// 					alert("Get MetaMask -> https://metamask.io/");
	// 					return;
	// 				}
	// 				connectWallet(ethereum, setCurrentAccount)
	// 			} catch (error) {
	// 				console.log(error)
	// 		}}}>
	// 			Connect Wallet
	// 		</button>
	// 	</div>
	// );
	// // Form to enter domain name and data
	// const renderInputForm = () => {
	// 	if (network !== usedChain.chainName) {
	// 		return (
	// 			// <div className="connect-wallet-container">
	// 			// 	<p>Please connect to the Polygon Mumbai Testnet</p>
	// 			// 	<button className='cta-button mint-button' onClick={() => {
	// 			// 		try {
	// 			// 			const { ethereum } = window;

	// 			// 			if (!ethereum) {
	// 			// 				alert("Get MetaMask -> https://metamask.io/");
	// 			// 				return;
	// 			// 			}
	// 			// 			switchNetwork(ethereum)
	// 			// 		} catch (error) {
	// 			// 			console.log(error)
	// 			// 	}
	// 			// 	}}>Click here to switch</button>
	// 			// </div>
	// 			<SwitchNetworkContainer />
	// 		);
	// 	}

	// 	return (
	// 		<div className="form-container">
	// 			<div className="first-row">
	// 				<input
	// 					type="text"
	// 					value={domain}
	// 					placeholder='domain'
	// 					onChange={e => setDomain(e.target.value)}
	// 				/>
	// 				<p className='tld'> {tld} </p>
	// 			</div>

	// 			<input
	// 				type="text"
	// 				value={record}
	// 				placeholder='record'
	// 				onChange={e => setRecord(e.target.value)}
	// 			/>
	// 			{/* If the editing variable is true, return the "Set record" and "Cancel" button */}
	// 			{editing ? (
	// 				<div className="button-container">
	// 					<button className='cta-button mint-button' disabled={loading} onClick={updateDomain}>
	// 						Set record
	// 					</button>
	// 					<button className='cta-button mint-button' onClick={() => {
	// 						setEditing(false)
	// 						setRecord('')
	// 						setDomain('')
	// 					}}>
	// 						Cancel
	// 					</button>
	// 				</div>
	// 			) : (
	// 				// If editing is not true, the mint button will be returned instead
	// 				<button className='cta-button mint-button' disabled={loading} onClick={mintDomain}>
	// 					{loading? <ThreeDotsWave /> : 'Mint'}
	// 				</button>
	// 			)}

	// 		</div>
	// 	);
	// }
	// Add this render function next to your other render functions
	// const renderMints = () => {
	// 	if (currentAccount && mints.length > 0) {
	// 		return (
	// 			<div >
	// 				<p className="subtitle"> Recently minted domains!</p>
	// 				<div className="mint-list">
	// 					{mints.map((mint, index) => {
	// 						return (
	// 							<div className="mint-item" key={mint.id}>
	// 								<div className='mint-row'>
	// 									<a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
	// 										<p className="underlined">{' '}{mint.name}{tld}{' '}</p>
	// 									</a>
	// 									{/* If mint.owner is currentAccount, add an "edit" button*/}
	// 									{mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
	// 										<button className="edit-button" onClick={() => editRecord(mint.name)}>
	// 											<img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
	// 										</button>
	// 										:
	// 										null
	// 									}
	// 								</div>
	// 								<p> {mint.record} </p>
	// 							</div>)
	// 					})}
	// 				</div>
	// 			</div>);
	// 	}
	// };
	// This will take us into edit mode and show us the edit buttons!
	const editRecord = (name) => {
		console.log("Editing record for", name);
		setEditing(true);
		setDomain(name);
	}

	const callSendEth = (domain, receiverAddress) => {
		setDomain(domain)
		setReceiverAddress(receiverAddress)
		handleOpenModal()
	}

	useEffect(() => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
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
		<div className="App">
			<div className="container">
				<div className="header-container">
					<header>
						<div className="left">
							<p className="title">🐸 Polygon Poggers Domains</p>
							<p className="subtitle">Your immortal API on the blockchain!</p>
						</div>
						<div className="right">
							<WalletHandle currentAccount={currentAccount} network={network} />
						</div>
					</header>
				</div>
				{/*Check if user is in the correct network*/}
				{(network !== usedChain.chainName) && <SwitchNetworkContainer />}
				{/*check if user is connected and in the correct network */}
				{(!currentAccount && (network === usedChain.chainName)) && <ConnectWalletContainer setCurrentAccount={setCurrentAccount} />}
				{(currentAccount && (network === usedChain.chainName))
					&& <InputForm
						domain={domain}
						setDomain={setDomain}
						record={record}
						setRecord={setRecord}
						editing={editing}
						setEditing={setEditing}
						fetchMints={fetchMints} />}
				<button onClick={handleOpenModal}>Send MATIC</button>
				{galleryAvailable && 
				<SendEthModal 
					open={openModal} 
					handleOpen={handleOpenModal} 
					handleClose={handleCloseModal} 
					domain={domain}
					receiverAddress={receiverAddress} />
				}
				{galleryAvailable
					&& <MintsGallery
						mints={mints}
						currentAccount={currentAccount}
						editRecord={editRecord}
						callSendEth={callSendEth} />}
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
