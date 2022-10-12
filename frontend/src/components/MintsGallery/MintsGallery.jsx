import React from 'react'
import {CONTRACT_ADDRESS, tld} from '../../constants'
import pencilIcon from '../../assets/pencil.png'
import moneyIcon from '../../assets/money.png'
import './MintsGallery.css'
import {motion} from 'framer-motion'
const MintsGallery = ({mints, currentAccount, editRecord, callSendEth}) => {
  return (
    <motion.div className="mint-container"
     whileInView={{opacity: [0,0,1], y: [100,50,0]}}
        transition={{duration: 0.5}}
    >
        <p className="subtitle"> Recently minted domains!</p>
        <div className="mint-list">
            {mints.map((mint) => {
                return (
                    <div className="mint-item" key={mint.id}>
                        <div className='mint-row'>
                            <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                                <p className="underlined">{' '}{mint.name}{tld}{' '}</p>
                            </a>
                            {/* If mint.owner is currentAccount, add an "edit" button*/}
                            {mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
                                <button className="edit-button" onClick={() => editRecord(mint.name)}>
                                    <img className="edit-icon" src={pencilIcon} alt="Edit button" />
                                </button>
                                :
                                <button className="edit-button" onClick={() => callSendEth(mint.name, mint.owner)}>
                                    <img className="edit-icon" src={moneyIcon} alt="Edit button" />
                                </button>
                            }
                        </div>
                        <p> {mint.record} </p>
                    </div>)
            })}
        </div>
    </motion.div>)
}

export default MintsGallery
