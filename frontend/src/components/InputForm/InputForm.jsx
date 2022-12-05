import React, { useState, useEffect } from 'react'
import { ethers } from "ethers";
import { motion } from 'framer-motion'
import { tld, CONTRACT_ADDRESS, contract_abi, itemVariant } from '../../constants'
import ThreeDotsWave from '../ThreeDotsWave/ThreeDotsWave'
import './InputForm.css'
const InputForm = ({ domain, setDomain, record, setRecord, editing, setEditing, fetchMints }) => {
    const [loading, setLoading] = useState(false)
    //set to fetch from contract when rendered with use effect
    const [maxDomainSize, setMaxDomainSize] = useState(0)
    const [maxRecordSize, setMaxRecordSize] = useState(0)

    const updateDomain = async () => {
        if (!record || !domain) { return }
        setLoading(true);
        console.log("Updating domain", domain, "with record", record);
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);

                let tx = await contract.setRecord(domain, record);
                await tx.wait();
                console.log("Record set https://mumbai.polygonscan.com/tx/" + tx.hash);

                await fetchMints();
                setRecord('');
                setDomain('');
                setEditing(false);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const mintDomain = async () => {
        // Don't run if the domain is empty
        if (!domain) { return }
        try {
            const { ethereum } = window;
            if (ethereum) {
                setLoading(true)
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);
                const available = await contract.checkDomainAvailability(domain)
                if(!available){
                    alert('Domain already in use!')
                    setDomain('')
                    setLoading(false)
                    return
                }
                const price = await contract.price()
                console.log("Going to pop wallet now to pay gas...")
                let tx;
                if (record) {
                    tx = await contract.registerWithRecord(domain, record, { value: price });
                } else {
                    tx = await contract.register(domain, { value: ethers.utils.parseEther(price) });
                } 
                // Wait for the transaction to be mined
                const receipt = await tx.wait();

                // Check if the transaction was successfully completed
                if (receipt.status === 1) {
                    console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);

                    // Call fetchMints after 2 seconds
                    setTimeout(() => {
                        fetchMints();
                    }, 2000);

                    setRecord('');
                    setDomain('');
                }
                else {
                    alert("Transaction failed! Please try again");
                }
                setLoading(false)

            }
        }
        catch (error) {
            setLoading(false)
            console.log(error);
            alert('something went wrong! Check if you have enough funds and are inputing the correct information')
        }
    }



    const checkSize = (variable, size) => {
        if (variable.length <= size) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        const getMaxSizes = async () => {
            try {
                const { ethereum } = window;
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);
                    const domainMS = await contract.domainMaxSize();
                    const recordMS = await contract.recordMaxSize();
                    setMaxDomainSize(domainMS)
                    setMaxRecordSize(recordMS)
                    console.log(`domainMS: ${domainMS}   recordMS: ${recordMS}`)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getMaxSizes()
    }, [])
    return (
        <motion.div className="form-container"
            variants={itemVariant}
        >
            <div className="first-row">
                <input
                    type="text"
                    value={domain}
                    placeholder='domain'
                    onChange={e => {
                        if (!editing) {
                            if (checkSize(e.target.value, maxDomainSize)) {
                                const strDomain = e.target.value.replace(/\s/g, '');
                                setDomain(strDomain)

                            }
                        }
                    }}
                />
                <p className='tld'> {tld} </p>
            </div>

            <input
                type="text"
                value={record}
                placeholder='record'
                onChange={e => {
                    if (checkSize(e.target.value, maxRecordSize)) {
                        setRecord(e.target.value)
                    }

                }}
            />
            {/* If the editing variable is true, return the "Set record" and "Cancel" button */}
            {editing ? (
                <div className="button-container">
                    <button className='cta-button mint-button' disabled={loading} onClick={updateDomain}>
                        {loading ? <ThreeDotsWave /> : 'Set Record'}
                    </button>
                    {!loading && <button className='cta-button mint-button' disabled={loading} onClick={() => {
                        setEditing(false)
                        setRecord('')
                        setDomain('')
                    }}>
                        Cancel
                    </button>}
                </div>
            ) : (
                // If editing is not true, the mint button will be returned instead
                <button className='cta-button mint-button' disabled={loading} onClick={mintDomain}>
                    {loading ? <ThreeDotsWave /> : 'Mint'}
                </button>
            )}

        </motion.div>
    )
}

export default InputForm
