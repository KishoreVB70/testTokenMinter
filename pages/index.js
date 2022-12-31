import Head from 'next/head'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from "../contract/erc20abi.json"



export default function Home() {
  const [userAccount, setUserAccount] = useState("");
  const [contract, setContract] = useState("");

  const [currentContractAddress, setCurrentContractAddress] = useState("");
  const [isSet, setIsSet] = useState(false);
  const [network, setNetwork] = useState("");
  const [userTokens, setUserTokens] = useState("");

  const goerliAddress = "0xA602b8d27844a573d5Ee9fAE415DfEe4805778fC";
  const mumbaiAddress = "0x0bcd90D8C7D5cb94F8897e46c244f0823b64CCEf";
  const sepoliaAddress = "0xF2c4f8aC5EfB4CB5FeE790481BA033b67E5D7ecB";

  const checkIfWalletConnected = async() => {
    try {
      const ethereum = window.ethereum;
  
      if (!ethereum) {
        console.error("Make sure you have Metamask!");
        return null;
      }
    
      const accounts = await ethereum.request({ method: "eth_accounts" });
    
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        return account;
      }else {
        console.error("No authorized account found");
        return null;
      }
    } catch(error){
      console.log("error: ", error);
    }
  }

  const connectWallet = async() => {
    try {
      const ethereum = window.ethereum;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
      console.log("Connected", accounts[0]);
      setUserAccount(accounts[0]);    
    }catch (error) {
      console.error(error);   
    }
  }

  const connectToContract = async(address, _chainId) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: _chainId }],
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const _contract = new ethers.Contract(address, abi.abi, signer);
    setContract(_contract);
    setCurrentContractAddress(address);

    let _balance = await _contract.balanceOf(userAccount);
    setUserTokens(_balance.toNumber());

    let _network = await provider.getNetwork()
    console.log(_network)
    setNetwork(_network);

    setIsSet(true)
  }

  const changeNetwork = async() => {
    setIsSet(false);
  }

  const mint = async() => {
    let txn = await contract.mint(500);
    await txn.wait();
    connectToContract(currentContractAddress, ethers.utils.hexlify(network.chainId));
  }


  useEffect(() => {
    checkIfWalletConnected().then((account) => {
      if(account !== null){
        setUserAccount(account);
      }
    });
  }, [])

  return (
    <div className='container'>
      <Head>
        <title>Test Minter</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='headingContainer'>
        <h1>Test Token Minter</h1>
      </div>
      
      <main className="main">
        {!userAccount &&
          <button onClick={connectWallet}>Connect Wallet</button>
        }

        {userAccount &&
          <>
            {isSet === false &&
              <div className="connect">
                <button onClick={() => connectToContract(goerliAddress, "0x5")} >Connect to Goerli Network</button>
                <button onClick={() => connectToContract(mumbaiAddress, "0x13881")} >Connect to Mumbai Network</button>
                <button onClick={() => connectToContract(sepoliaAddress, "0xAA36A7")}>Connect to sepolia Network</button>
              </div>
            }
            {isSet === true &&
              <div className="content">
                <h1>Connected to {network.name}</h1>
                <h3>Contract address: {currentContractAddress}</h3>
                <h3>Tokens of user: {userTokens}</h3>
                <button onClick={mint} >Mint 500 tokens</button>
                <button onClick={() => changeNetwork()}>Change Network</button>
              </div>
            }
          </>
        }
      </main>
    </div>
  )
}
