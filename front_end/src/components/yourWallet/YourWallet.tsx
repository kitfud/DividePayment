import React from 'react';
import { Token } from "../Main"
import { Box } from '@material-ui/core'
import { formatEther } from '@ethersproject/units'
import { useEthers, useEtherBalance } from '@usedapp/core'

interface YourWalletProps {
    supportedTokens: Array<Token>
}

const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const { account } = useEthers()
    const etherBalance = useEtherBalance(account)

    return (
        <Box>
            <h1>Wallet:</h1>
            <Box>
                {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
            </Box>
        </Box>
    )
};

export default YourWallet;
