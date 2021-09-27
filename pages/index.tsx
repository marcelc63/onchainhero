import * as React from 'react'
import { useEffect, useState } from 'react'
import artifact from '~/assets/OnChainHero.json'
import { ethers } from 'ethers'

import Modal from '~/components/base/Modal'

// Constants
const TWITTER_HANDLE = 'marcelc63'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/onchainhero'
const TOTAL_MINT_COUNT = 50
const CONTRACT_ADDRESS = '0x9EeF8888740933DaEfFD672CccbbB008ae51b6DB'

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [minting, setMinting] = useState(false)

  const checkIfWalletIsConnected = async () => {
    const { ethereum }: any = window

    if (!ethereum) {
      console.log('Make sure you have metamask!')
      return
    } else {
      console.log('We have the ethereum object', ethereum)
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account:', account)
      setCurrentAccount(account)
      setupEventListener()
    } else {
      console.log('No authorized account found')
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum }: any = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      setupEventListener()

      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    try {
      const { ethereum }: any = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          artifact.abi,
          signer
        )

        connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          )
        })

        console.log('Setup event listener!')
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum }: any = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          artifact.abi,
          signer
        )

        console.log('Going to pop wallet now to pay gas...')
        let nftTxn = await connectedContract.makeAnEpicNFT()

        setMinting(true)

        console.log('Mining...please wait.')
        await nftTxn.wait()

        setMinting(false)

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        )
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="font-bold button-comic text-xl border-4 border-purple-500 p-4 rounded-xl bg-white mb-4 text-purple-500 hover:bg-purple-100"
    >
      Connect to Wallet
    </button>
  )

  const renderMintUI = () => (
    <button
      onClick={askContractToMintNft}
      className="font-bold button-comic text-xl border-4 border-purple-500 p-4 rounded-xl bg-white mb-4 text-purple-500 hover:bg-purple-100"
    >
      Mint NFT
    </button>
  )

  const openSeaLink = () => (
    <a href={OPENSEA_LINK}>
      <button className="font-bold button-comic text-xl border-4 border-purple-500 p-4 rounded-xl bg-white mb-4 text-purple-500 hover:bg-purple-100">
        See OpenSea Collection
      </button>
    </a>
  )

  return (
    <div className="w-full min-h-screen bg-img flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <p className="text-6xl md:text-8xl text-white font-bold text-center mb-2 font-brush">
          OnChainHero
        </p>
        <p className="text-2xl text-white font-bold text-center mb-8">
          Get your Super Hero License Today!
        </p>
        {currentAccount === '' ? renderNotConnectedContainer() : renderMintUI()}
        {openSeaLink()}
      </div>
      <div className="flex flex-row items-center">
        <img alt="Twitter Logo" className="w-10" src="/twitter-logo.svg" />
        <p className="text-white">
          built by{' '}
          <a
            className="text-white underline"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>{' '}
          as a{' '}
          <a
            className="text-white underline"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >
            @_buildspace
          </a>{' '}
          final project
        </p>
      </div>
      <Modal open={minting}>
        <p className="text-center text-4xl animate-bounce font-brush text-purple-500">
          Printing Your Hero License... 🦸
        </p>
      </Modal>
    </div>
  )
}
