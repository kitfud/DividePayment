import React, { useEffect, useState } from 'react';
import { ethers, constants, utils } from 'ethers'
import DividePayment from "../chain-info/contracts/DividePayment.json"
import networkMapping from "../chain-info/deployments/map.json"


const DividePaymentApp = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [testFunctionVal, setCurrentContractVal] = useState(null);
    const [contractBalance, setContractBalance] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const { abi } = DividePayment
    const dividePaymentAddress = "0x5b4AaAf80b216314A7CD5ee078dBE60B16e50F53"
    // const { chainId } = provider.getNetwork()
    // console.log(chainId)

    // let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    // setProvider(tempProvider);





    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {

            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected');




                })
                .catch(error => {
                    setErrorMessage(error.message);

                });

        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }
    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();

    }

    const chainChangedHandler = () => {
        // reload the page to avoid any errors with chain change mid use of application
        window.location.reload();
    }

    const getWalletBalance = async (provider) => {
        // Look up the balance
        if (provider !== null) {
            let balance = await provider.getBalance(defaultAccount);
            setWalletBalance(ethers.utils.formatEther(balance))
        }

    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);
        // console.log(provider)


        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);
        // console.log(signer)

        let tempContract = new ethers.Contract(dividePaymentAddress, abi, tempSigner);
        setContract(tempContract);
        // console.log(contract)
    }


    // listen for account changes
    window.ethereum.on('accountsChanged', accountChangedHandler);

    window.ethereum.on('chainChanged', chainChangedHandler);


    const getTestFunction = async () => {
        let val = await contract.testFunction()
        setCurrentContractVal(val.toString());
    }

    const getBalance = async () => {
        let balance = await contract.getBalance()
        setContractBalance(ethers.utils.formatEther(balance))

    }

    const setDeposit = (event) => {
        event.preventDefault();
        const amountwei = ethers.utils.parseEther(event.target.setText.value)
        console.log('sending ' + amountwei + ' to the contract');
        // contract.deposit({ "value": event.target.setText.value })
        signer.sendTransaction({ to: dividePaymentAddress, value: amountwei }).then((txObj) => {
            console.log('txHash', txObj.hash)
        })

    }


    useEffect(() => {
        getWalletBalance(provider)
    }, [provider])


    return (<div>
        <button onClick={connectWalletHandler}>{connButtonText}</button>
        <div>
            <h3>Address: {defaultAccount}</h3>
            <h3>Wallet Balance: {walletBalance}</h3>
        </div>
        {/* <div>
            <button onClick={getTestFunction} style={{ marginTop: '5em' }}> Get Current Contract Value </button>
            {testFunctionVal}
        </div> */}

        <div>
            <button onClick={getBalance} style={{ marginTop: '5em' }}> DividePayment Contract Balance</button>
            {contractBalance}
        </div>

        <form onSubmit={setDeposit}>
            <input id="setText" type="text" />
            <button type={"submit"}> Send ETH to DividePayment_Contract </button>
        </form>

        {errorMessage}
    </div>)

};

export default DividePaymentApp;
