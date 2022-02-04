import React, { useState, useEffect } from 'react';
import { useEthers, useContractFunction, useContractCall } from '@usedapp/core';
import { Button, makeStyles } from '@material-ui/core'
import DividePayment from "../chain-info/contracts/DividePayment.json"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils, BigNumber, providers } from "ethers"
import { formatEther } from '@ethersproject/units'
import Web3 from 'web3';





const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        theme: 'flex',
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    }
}))



const Header = () => {


    const { chainId, account } = useEthers()
    const { abi: contractABI } = DividePayment
    const dividePaymentAddress = chainId ? networkMapping[String(chainId)]["DividePayment"][0] : constants.AddressZero
    const dividePaymentInterface = new utils.Interface(contractABI)

    const dividePaymentContract = new Contract(dividePaymentAddress, dividePaymentInterface)

    const { send: testFunction, state: testFunctonState } = useContractFunction(dividePaymentContract, "testFunction", { transactionName: "test function" })



    const [testVal, setTestVal] = useState(0)

    const GetBalanceNow = async () => {
        console.log("test function started")
        const result: any = await testFunction({ account })
        setTestVal(result)
        console.log("test function run")

    }


    const classes = useStyles()

    const { activateBrowserWallet, deactivate } = useEthers()

    const isConnected = account !== undefined

    return (

        <div className={classes.container}>
            {
                isConnected ?
                    (<Button color="primary" variant="contained" onClick={deactivate}>Disconnect</Button>) :
                    (<Button variant="contained" color="primary" onClick={activateBrowserWallet}>Connect</Button>)
            }

            <Button onClick={GetBalanceNow}>Get Contract Balance</Button>
        </div>


    )

};

export default Header;
