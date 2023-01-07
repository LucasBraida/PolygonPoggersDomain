import React, { forwardRef, useState } from 'react'
import { Modal, Tooltip} from '@mui/material';
import ThreeDotsWave from '../ThreeDotsWave/ThreeDotsWave'
import { stringOfNumberWithDecimal, sendNativeToken } from '../../utils'
import { tld } from '../../constants'
import './SendMaticModal.css'

const SendMaticModal = ({ open, handleOpen, handleClose, domain, receiverAddress }) => {
    const [loading, setLoading] = useState(false)
    
    const [sucessfulTx, setSucessfulTx] = useState(false)
    // forwardRef necessary to be compatible with Material Modal
    const Window = forwardRef(({ domain, receiverAddress }, ref) => {
        
        const [value, setValue] = useState("0")

        const visibleAddress = `${receiverAddress.slice(0, 6)}...${receiverAddress.slice(-4)}`
        return (
            <div className='modalWindow'>
                <div className='modalWindow-header'>
                    <h3>Send some MATIC to</h3>
                    <Tooltip title={receiverAddress}>
                        <h2 className='underlined'>{`${domain}${tld}`}</h2>
                    </Tooltip>
                </div>
                <input
                    type="text"
                    value={visibleAddress}
                    placeholder='domain'
                    onChange={e => { }}
                    className="modalWindow-row"
                />

                <input
                    type="text"
                    value={value}
                    placeholder='record'
                    onChange={e => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "")
                        if (onlyNumbers.length < 6) {
                            setValue(stringOfNumberWithDecimal(onlyNumbers, 3))
                        }
                    }}
                    className="modalWindow-row"
                />
                <button
                    className={`modalWindow-button ${sucessfulTx && 'modalWindow-button--success'}`}
                    disabled={loading || sucessfulTx}
                    onClick={async () => {
                        if (parseFloat(value) > 0) {
                            setLoading(true)
                            const sent = await sendNativeToken(receiverAddress, value)
                            setSucessfulTx(sent)
                            setLoading(false)
                        }
                    }}
                >{loading ? <ThreeDotsWave /> : (sucessfulTx ? 'MATIC Sent' : 'Send MATIC')}</button>
            </div>
        )
    })
    return (
        <Modal
            open={open || loading}
            onClose={() => {
                setSucessfulTx(false)
                handleClose()}}
        >
            <Window domain={domain} receiverAddress={receiverAddress} />
        </Modal>
    )
}

export default SendMaticModal
