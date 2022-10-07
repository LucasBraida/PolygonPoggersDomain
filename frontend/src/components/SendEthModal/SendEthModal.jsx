import React, {forwardRef} from 'react'
import { Modal, Box, Typography } from '@mui/material';
import './SendEthModal.css'
const SendEthModal = ({ open, handleOpen, handleClose, senderAccount, receiverAccount }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const Window = forwardRef(({teste}, ref) => (
        <div className='modalWindow'>
                <input
                    type="text"
                    value='domain'
                    placeholder='domain'
                    onChange={e => {console.log(e.target.value)}}
                    className="modalWindow-row"
                />

            <input
                type="text"
                value='record'
                placeholder='record'
                onChange={e => {console.log(e.target.value)}}
                className="modalWindow-row"
            />
            <div className='modalWindow-button'>
            <button className='cta-button mint-button'>Send MATIC</button>
            </div>


        </div>
    ))
    return (
        <Modal
            open={open}
            onClose={handleClose}
            // aria-labelledby="modal-modal-title"
            // aria-describedby="modal-modal-description"
            >
            <Window teste='bla'/>
        </Modal>
    )
}

export default SendEthModal
