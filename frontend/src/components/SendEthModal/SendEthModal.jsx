import React, { forwardRef, useState } from 'react'
import { Modal, Tooltip } from '@mui/material';
import { stringOfNumberWithDecimal, sendNativeToken } from '../../utils'
import './SendEthModal.css'
const SendEthModal = ({ open, handleOpen, handleClose, domain, receiverAddress }) => {
    const [loading, setLoading] = useState(false)
    

    const Window = forwardRef(({ domain, receiverAddress }, ref) => {
        const [value, setValue] = useState("0")
        const visibleAddress = `${receiverAddress.slice(0, 6)}...${receiverAddress.slice(-4)}`
        return (
        <div className='modalWindow'>
            <div className='modalWindow-header'>
                <h3>Send some MATIC to</h3>
                <Tooltip title={receiverAddress}>
                    <h2>{domain}</h2>
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
            <button className='modalWindow-button' onClick={async () => {
                if (parseFloat(value) > 0) {
                    setLoading(true)
                    await sendNativeToken(receiverAddress, value)
                    setLoading(false)
                }
                // (parseFloat(value) > 0) && sendNativeToken(receiverAddress, value)
            }}>Send MATIC</button>
        </div>
        )
    })
    return (
        <Modal
            open={open || loading}
            onClose={handleClose}
        >
            <Window domain={domain} receiverAddress={receiverAddress} />
        </Modal>
    )
}

export default SendEthModal
