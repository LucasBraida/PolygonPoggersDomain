import {networks} from './networks'
import {connectWallet} from './connectWallet'
import {checkIfWalletIsConnected} from './checkIfWalletIsConnected'
import { checkCurrentNetwork } from './checkCurrentNetwork'
import {handleChangedAccount} from './handleChangedAccount'
import {handleChangedChain} from './handleChangedChain'
import {switchNetwork} from './switchNetwork'
import {sendNativeToken} from './sendNativeToken'
import {stringOfNumberWithDecimal} from './stringOfNumberWithDecimal'
import {checkForWallet} from './checkForWallet'

export {
    networks,
    connectWallet,
    checkIfWalletIsConnected,
    checkCurrentNetwork,
    handleChangedAccount,
    handleChangedChain,
    switchNetwork,
    sendNativeToken,
    stringOfNumberWithDecimal,
    checkForWallet
}
