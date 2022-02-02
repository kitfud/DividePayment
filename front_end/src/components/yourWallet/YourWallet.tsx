import React, { useState } from 'react';
import { Token } from "../Main"
import { Box } from '@material-ui/core'
import { formatEther } from '@ethersproject/units'
import { useEthers, useEtherBalance } from '@usedapp/core'
import { Button, Input } from "@material-ui/core"

interface YourWalletProps {
    supportedTokens: Array<Token>
}

const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const { account } = useEthers()
    const etherBalance = useEtherBalance(account)

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }
    return (
        <Box>
            <h1>Wallet:</h1>
            <Box>
                {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
            </Box>
            <Box>
                <Input onChange={handleInputChange} />
                <Button variant="contained" color="primary">Deposit ETH Into Contract</Button>

            </Box>

        </Box>
    )
};

export default YourWallet;
