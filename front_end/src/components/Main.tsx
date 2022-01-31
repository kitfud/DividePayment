import React from 'react';

import { useEthers } from '@usedapp/core'
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from 'ethers'
import brownieConfig from "../brownie-config.json"
import weth from "../eth.png"
import YourWallet from "./yourWallet/YourWallet"

export type Token = {
    image: string
    address: string
    name: string
}

const Main = () => {

    const { chainId } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"

    console.log(networkName)
    const dividePaymentAddress = chainId ? networkMapping[String(chainId)]["DividePayment"][0] : constants.AddressZero

    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero //brownie config

    const supportedTokens: Array<Token> = [
        {
            image: weth,
            address: wethTokenAddress,
            name: "WETH"
        }
    ]

    return (
        <YourWallet supportedTokens={supportedTokens}></YourWallet>
    )

};

export default Main;
