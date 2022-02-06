import React, { useEffect, useState } from 'react';
import { ethers, constants, utils } from 'ethers'
import DividePayment from "../chain-info/contracts/DividePayment.json"
import networkMapping from "../chain-info/deployments/map.json"
import { Button, Input, CircularProgress, Box } from "@mui/material"

const DividePaymentApp = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [testFunctionVal, setCurrentContractVal] = useState(null);
    const [contractBalance, setContractBalance] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [paygroup, setPayGroup] = useState(null);
    const [inpaygroup, setInPayGroup] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [accountchanging, setAccountChanging] = useState(false)
    const [txstatus, setTxStatus] = useState(null)
    const [processing, setProcessing] = useState(false)

    const [txhash, setTxHash] = useState(null)

    const { abi } = DividePayment
    const dividePaymentAddress = "0x5b4AaAf80b216314A7CD5ee078dBE60B16e50F53"


    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            console.log("CONNECTING TO WALLET")
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

    const checkAccountType = (newAccount) => {
        if (Array.isArray(newAccount)) {
            return newAccount[0].toString()
        }
        else {
            return newAccount
        }
    }

    const accountChangedHandler = (newAccount) => {
        if (!accountchanging) {
            setAccountChanging(true)
            setInPayGroup(false)
            setIsAdmin(false)

            console.log("account change happened")
            setDefaultAccount(checkAccountType(newAccount));
            updateEthers();
        }

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

    }

    const getBalance = async () => {
        let balance = await contract.getBalance()
        setContractBalance(ethers.utils.formatEther(balance))

    }

    const getPayGroup = async () => {
        let paygroupGet = await contract.getPayGroup()
        setPayGroup(paygroupGet)

    }

    const checkIfAdmin = () => {
        if (contract !== null) {
            contract.owner().then((res) => {

                console.log(res.toUpperCase())
                console.log(defaultAccount.toUpperCase())

                if (res.toUpperCase() == defaultAccount.toUpperCase()) {
                    setIsAdmin(true)
                }
                else {
                    setIsAdmin(false)
                }

            })
        }
    }



    const checkIfInPaygroup = () => {

        let currentAccount = defaultAccount.toUpperCase()
        for (let i = 0; i < paygroup.length; i++) {
            if (paygroup[i].toUpperCase() == currentAccount) {
                setInPayGroup(true)
            }
        }



    }

    const testTransactionFilled = (event) => {
        event.preventDefault()
        isTransactionMined(txhash)
    }

    const isTransactionMined = async (transactionHash) => {
        let transactionBlockFound = false

        while (transactionBlockFound === false) {
            let tx = await provider.getTransactionReceipt(transactionHash)
            console.log("transaction status check....")
            try {
                await tx.blockNumber
            }
            catch (error) {
                tx = await provider.getTransactionReceipt(transactionHash)
            }
            finally {
                console.log("proceeding")
            }


            if (tx && tx.blockNumber) {
                setProcessing(false)
                console.log("block number assigned.")
                transactionBlockFound = true
                setTxStatus("complete")
                setTxStatus(tx)
                console.log("COMPLETE BLOCK: " + tx.blockNumber.toString())
                //check balance of contract and user wallet

                getBalance()
                getWalletBalance(provider)

            }
        }


    }

    useEffect(() => {
        console.log("UPDATE:" + txstatus)
    }, [txstatus])

    useEffect(() => {

    }, [])


    const setDeposit = async (event) => {
        event.preventDefault();
        setProcessing(true)
        const amountwei = ethers.utils.parseEther(event.target.setText.value)
        console.log('sending ' + amountwei + ' to the contract');
        // contract.deposit({ "value": event.target.setText.value })
        const tx = await signer.sendTransaction({ to: dividePaymentAddress, value: amountwei }).then((txObj) => {
            console.log('txHash', txObj.hash)
            let hashin = txObj.hash
            setTxHash(hashin.toString())
            isTransactionMined(hashin.toString())

        }).catch(error =>
            setProcessing(false))

        if (txhash !== null) {
            setTxStatus(tx)
            console.log(tx)
        }




        document.getElementById("setText").value = "";
    }

    const withdrawOwed = async (event) => {
        event.preventDefault()
        setProcessing(true)
        const tx = contract.releaseOwedPayment().then((txObj) => {
            console.log('txHash', txObj.hash)
            let hashin = txObj.hash
            setTxHash(hashin.toString())
            isTransactionMined(hashin.toString())

        }).catch(error =>
            setProcessing(false))

        if (txhash !== null) {
            setTxStatus(tx)
            console.log(tx)
        }
        // console.log(tx)
    }

    const AdminDisbursePayments = async (event) => {
        event.preventDefault()
        setProcessing(true)
        const tx = await contract.AdminReleaseAllPayments().then((res) => {
            console.log(res)
            console.log(res.hash)

            let hashin = res.hash
            setTxHash(hashin.toString())
            isTransactionMined(hashin.toString())

        }).catch(error =>
            setProcessing(false))

        if (txhash !== null) {
            setTxStatus(tx)
            console.log(tx)
        }
    }


    // window.ethereum.on('accountsChanged', accountChangedHandler);
    // window.ethereum.on('chainChanged', chainChangedHandler);
    useEffect(() => {
        if (accountchanging === false) {
            // listen for account changes
            window.ethereum.on('accountsChanged', accountChangedHandler);
            window.ethereum.on('chainChanged', chainChangedHandler);
        }
        else {
            window.ethereum.removeListener('accountsChanged', accountChangedHandler);
            window.ethereum.removeListener('chainChanged', chainChangedHandler);
        }

    }, [accountchanging])

    useEffect(() => {
        getWalletBalance(provider)

    }, [provider])

    useEffect(() => {
        if (contract !== null) {
            getPayGroup()
            checkIfAdmin()
            console.log(isAdmin)
            getBalance()
            setAccountChanging(false)

        }
    }, [contract])

    useEffect(() => {
        if (paygroup !== null) {

            checkIfInPaygroup()

        }
    }, [paygroup])






    return (<div>
        <Button onClick={connectWalletHandler} variant="contained" color="primary">{connButtonText}</Button>
        {/* <button onClick={testTransactionFilled}>Test Transaction Filled</button> */}

        {
            defaultAccount ? (
                <div>
                    <Box>
                        <h3>Address: {defaultAccount}</h3>
                        <h3>Wallet Balance: {walletBalance}</h3>
                        <h3>Contract Balance: {contractBalance}</h3>
                    </Box>


                    <Box>
                        {
                            inpaygroup ? (
                                <Button onClick={withdrawOwed} variant="contained" color="primary">{processing ? <CircularProgress size={26} color="secondary" /> : "Withdraw Payment"}</Button>
                            ) : (
                                null
                            )
                        }
                    </Box>

                    <Box>
                        {
                            isAdmin ? (<>
                                <h2>WELCOME ADMIN:</h2>
                                <Button onClick={AdminDisbursePayments} variant="contained" color="primary">{processing ? <CircularProgress size={26} color="secondary" /> : "Disburse Payments To Payees"}</Button>
                            </>

                            ) : (
                                null
                            )
                        }
                    </Box>

                    <Box>
                        <h3>MAKE A DEPOSIT:</h3>
                        <form onSubmit={setDeposit}>
                            <Input id="setText" type="text" />
                            <Button type={"submit"} variant="contained" color="info">  {processing ? <CircularProgress size={26} color="secondary" /> : "Send ETH To Contract"} </Button>
                        </form>

                    </Box>






                </div>
            ) :
                (
                    <div>
                        {errorMessage}
                    </div>
                )
        }




    </div>)

};

export default DividePaymentApp;