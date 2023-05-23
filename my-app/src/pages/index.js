import Head from "next/head";
import styles from '../styles/Home.module.css';
import Web3modal from 'web3modal';
import {providers, Contract} from 'ethers';
import { useEffect, useState, useRef } from "react";
import { WHITELIST_CONTRACT_ABI, WHITELIST_CONTRACT_ADDRESS } from "@/Constants";

export default function Home(){

    const[numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
    const[isConnected, setIsConnected] = useState(false);
    const[joinedWhitelist, setJoinedWhitelist] = useState(false);
    const[loading, setLoading] = useState(false);
    const web3ModalRef = useRef();

    const getProviderOrSigner = async (needSigner = false) => {

      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const {chainId} = await web3Provider.getNetwork();

      if(chainId != 5){
        window.alert("please switch to goerli network");
        throw new Error("network connected is not goerli");
      }

      if(needSigner){
        const signer =  await web3Provider.getSigner();
        return signer;
      }

      return web3Provider;

    }

    const addAddressToWhitelist = async () => {
      try{
          const signer = await getProviderOrSigner(true);

          const contract = new Contract(
            WHITELIST_CONTRACT_ADDRESS,
            WHITELIST_CONTRACT_ABI,
            signer
          );

          const tx = await contract.addAddressToWhitelist();
          
          setLoading(true);
          await tx.wait();
          setLoading(false);

          await getNumberOfWhitelisted();

          setJoinedWhitelist(true);


      }catch(err){
          console.log(err);
      }
    }

    const getNumberOfWhitelisted = async () => {
      try{
        const provider = await getProviderOrSigner();
        const contract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          WHITELIST_CONTRACT_ABI,
          provider
        );
        
        const _numberOfWhitelisted = await contract.numAddressesWhitelisted();

        setNumberOfWhitelisted(_numberOfWhitelisted);

      }catch(err){
        console.log(err);
      }
    }

    const checkIfAddressInWhitelist = async () => {
      try {
        
        const signer = await getProviderOrSigner(true);
        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          WHITELIST_CONTRACT_ABI,
          signer
        );
        const address = await signer.getAddress();
        const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
          address
        );
        setJoinedWhitelist(_joinedWhitelist);
      } catch (err) {
        console.error(err);
      }
    };

    const connectWallet = async () => {
      try{
        await getProviderOrSigner();
        setIsConnected(true);

        checkIfAddressInWhitelist();
        getNumberOfWhitelisted();

      }catch(err){
        console.log(err);
      }
    };

    const renderButton = () => {
      if (isConnected) {
        if (joinedWhitelist) {
          return (
            <div className={styles.description}>
              Thanks for joining the Whitelist!
            </div>
          );
        } else if (loading) {
          return <button className={styles.button}>Loading...</button>;
        } else {
          return (
            <button onClick={addAddressToWhitelist} className={styles.button}>
              Join the Whitelist
            </button>
          );
        }
      } else {
        return (
          <button onClick={connectWallet} className={styles.button}>
            Connect your wallet
          </button>
        );
      }
    };

    useEffect(() => {
      if (!isConnected) {
        
        web3ModalRef.current = new Web3modal({
          network: "goerli",
          providerOptions: {},
          disableInjectedProvider: false,
        });
        connectWallet();
      }
    }, [isConnected]);

    return (
      <div>
        <Head>
          <title>Whitelist Dapp</title>
          <meta name="description" content="Whitelist-Dapp" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
          <div>
            <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
            <div className={styles.description}>
              {/* Using HTML Entities for the apostrophe */}
              It&#39;s an NFT collection for developers in Crypto.
            </div>
            <div className={styles.description}>
              {numberOfWhitelisted} have already joined the Whitelist
            </div>
            {renderButton()}
          </div>
          <div>
            <img className={styles.image} src="./crypto-devs.svg" />
          </div>
        </div>
  
        <footer className={styles.footer}>
          Made with &#10084; by Crypto Devs
        </footer>
      </div>
    );
}