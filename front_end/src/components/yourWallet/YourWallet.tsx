import React, { useState, useEffect } from 'react';
import { Token } from "../Main"
import { Box } from '@material-ui/core'
import { formatEther } from '@ethersproject/units'
import { useEthers, useEtherBalance, useSendTransaction } from '@usedapp/core'
import { Button, Input } from "@material-ui/core"
import { utils } from 'ethers'


interface YourWalletProps {
    supportedTokens: Array<Token>
    contractAddress: string
}

const YourWallet = ({ supportedTokens, contractAddress }: YourWalletProps) => {
    const { account } = useEthers()
    const etherBalance = useEtherBalance(account)

    const [amount, setAmount] = useState<number | string>(0)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const { sendTransaction, state } = useSendTransaction()
    const [isDisabled, setDisabled] = useState(false);

    useEffect(() => {
        if (state.status != 'Mining') {
            setDisabled(false)
            setAmount('0')
        }
    }, [state])

    const handleSubmitDeposit = () => {
        setDisabled(true)
        sendTransaction({ to: contractAddress, value: utils.parseEther(amount.toString()) })
    }


    return (
        <Box>
            <h1>Wallet:</h1>
            <Box>
                {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
            </Box>
            <Box>
                <Input onChange={handleInputChange} disabled={isDisabled} />
                <Button variant="contained" color="primary" onClick={handleSubmitDeposit}>Deposit ETH Into Contract</Button>

            </Box>

        </Box>
    )
};

export default YourWallet;
