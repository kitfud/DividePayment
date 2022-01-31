import React from 'react';

import { useEthers } from '@usedapp/core'
import helperConfig from "../helper-config.json"

const Main = () => {

    const { chainId } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"

    console.log(networkName)

    return (
        <div>Hello</div>
    )

};

export default Main;
