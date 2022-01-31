import React from 'react';
import { useEthers } from '@usedapp/core';

const Header = () => {

    const { account, activateBrowserWallet, deactivate } = useEthers()

    const isConnected = account !== undefined

    return (
        <div>
            {
                isConnected ? (<button color="primary" onClick={deactivate}>Disconnect</button>) :
                    (<button color="primary" onClick={activateBrowserWallet}>Connect</button>)
            }
        </div>
    )



};

export default Header;
