import React from 'react'
import {CONTRACT_ADDRESS, tld} from '../../constants'
import pencilIcon from '../../assets/pencil.png'
import moneyIcon from '../../assets/money.png'
import './MintsGallery.css'
const MintsGallery = ({mints, currentAccount, editRecord, callSendEth}) => {
  return (
    <div className="mint-container">
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
    </div>)
}

export default MintsGallery
