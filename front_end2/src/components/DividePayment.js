import React, { useEffect, useState } from 'react';
import { ethers, constants, utils } from 'ethers'
import DividePayment from "../chain-info/contracts/DividePayment.json"
import networkMapping from "../chain-info/deployments/map.json"


const DividePaymentApp = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [contractBalance, setContractBalance] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [paygroup, setPayGroup] = useState(null);
    const [inpaygroup, setInPayGroup] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const { abi } = DividePayment
    const dividePaymentAddress = "0x5b4AaAf80b216314A7CD5ee078dBE60B16e50F53"


    const connectWalletHandler = () => {

        if (window.ethereum && window.ethereum.isMetaMask) {


            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {


                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected/Click To Refresh Balance');



                })
                .catch(error => {
                    setErrorMessage(error.message);

                });

        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }


    const chainChangedHandler = () => {
        // reload the page to avoid any errors with chain change mid use of application

        window.location.reload();
    }

    const getWalletBalance = async (providerIn) => {
        // Look up the balance
        if (typeof providerIn === 'object' && providerIn !== null) {
            console.log(providerIn)
            let balance = await providerIn.getBalance(defaultAccount);
            setWalletBalance(ethers.utils.formatEther(balance))
        }

    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);
        // console.log(signer)

        let tempContract = new ethers.Contract(dividePaymentAddress, abi, tempProvider);
        setContract(tempContract);



    }

    const accountChangedHandler = (newAccount) => {
        setProvider(null)
        setInPayGroup(null)
        setIsAdmin(null)
        setSigner(null)
        setContract(null)

        console.log("new account " + newAccount)
        if (newAccount !== null) {
            setDefaultAccount(newAccount);
            updateEthers();
        }



    }
    // listen for account changes
    window.ethereum.on('accountsChanged', accountChangedHandler);

    window.ethereum.on('chainChanged', chainChangedHandler);


    const getBalance = async () => {
        let balance = await contract.getBalance()
        setContractBalance(ethers.utils.formatEther(balance))

    }

    const getContractPayGroup = async () => {
        let paygroupGet = await contract.getPayGroup()
        setPayGroup(paygroupGet)

    }

    const checkIfAdmin = () => {
        if (contract !== null && defaultAccount !== null | defaultAccount) {
            contract.owner().then((res) => {

                //
                let acc = defaultAccount.toString()

                if (res.toUpperCase() === acc.toUpperCase()) {
                    setIsAdmin(true)
                }
                else {
                    setIsAdmin(false)
                }

            })
        }
    }



    const checkIfInPaygroup = () => {
        console.log("default account " + defaultAccount)
        if (defaultAccount !== null) {
            let current = defaultAccount.toString()
            let currentAccount = current.toUpperCase()

            for (let i = 0; i < paygroup.length; i++) {
                if (paygroup[i].toUpperCase() == currentAccount) {
                    setInPayGroup(true)
                }
            }

        }

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

    const withdrawOwed = (event) => {
        event.preventDefault()
        const tx = contract.releaseOwedPayment()
        console.log(tx)
    }

    const AdminDisbursePayments = (event) => {
        event.preventDefault()
        contract.AdminReleaseAllPayments().then((res) => {
            console.log(res)
        })
    }

    useEffect(() => {
        if (contract) {
            getContractPayGroup()
            checkIfAdmin()
            getBalance()
            getWalletBalance(provider)

        }
    }, [contract])

    useEffect(() => {
        if (paygroup) {
            checkIfInPaygroup()
        }

    }, [paygroup])





    return (<div>
        <button onClick={connectWalletHandler}>{connButtonText}</button>
        <div>
            <h3>Address: {defaultAccount}</h3>
            <h3>Wallet Balance: {walletBalance}</h3>
            <h3>Contract Balance: {contractBalance}</h3>
        </div>

        <div>
            {
                inpaygroup ? (
                    <button onClick={withdrawOwed}>Withdraw Payment Into Account</button>
                ) : (
                    <span></span>
                )
            }
        </div>

        <div>
            {
                isAdmin ? (
                    <button onClick={AdminDisbursePayments}>Disburse Payments to Payees</button>
                ) : (
                    <span></span>
                )
            }
        </div>

        <h3>MAKE A DEPOSIT:</h3>
        <form onSubmit={setDeposit}>
            <input id="setText" type="text" />
            <button type={"submit"}> Send ETH to DividePayment_Contract </button>
        </form>


    </div>)

};

export default DividePaymentApp;
