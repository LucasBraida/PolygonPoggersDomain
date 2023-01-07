import { CONTRACT_ADDRESS } from "./contractAddress";
import CONTRACT_ABI_JSON from './ContractABI.json'
import {usedChain} from './usedChain'
import {tld} from './tld'
import {containerVariant, itemVariant} from './montionVariants'
const contract_abi = CONTRACT_ABI_JSON.abi

export {CONTRACT_ADDRESS, contract_abi, usedChain, tld, containerVariant, itemVariant}
