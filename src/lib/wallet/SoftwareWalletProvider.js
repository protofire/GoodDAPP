// @flow
import Web3 from 'web3'
import Secrets from '../../secrets.json'
//import conf from '../../client.config.js'
import bip39 from 'bip39'
import type { WalletConfig } from './WalletFactory'

class SoftwareWalletProvider {
  ready: Promise<Web3>
  GD_USER_PKEY: string = 'GD_USER_PKEY'
  conf: WalletConfig

  constructor(conf: WalletConfig) {
    this.conf = conf
    this.ready = this.init()
  }

  getPKey() {
    return localStorage.getItem(this.GD_USER_PKEY)
  }
  async init(): Promise<Web3> {
    let provider = this.getWeb3TransportProvider()
    let web3 = new Web3(provider)
    //let web3 = new Web3(new WebsocketProvider("wss://ropsten.infura.io/ws"))

    let pkey: ?string = localStorage.getItem(this.GD_USER_PKEY)
    let account
    if (!pkey) {
      account = await web3.eth.accounts.create()

      console.log('account Add is:', account.address)
      console.log('Private Key is:', account.privateKey)
      localStorage.setItem(this.GD_USER_PKEY, account.privateKey)
      pkey = localStorage.getItem(this.GD_USER_PKEY)

      console.log('item set in localStorage ', { pkey })
    } else {
      console.log('pkey found, creating account from pkey:', { pkey })
    }

    web3.eth.accounts.wallet.add(pkey)
    web3.eth.defaultAccount = web3.eth.accounts.wallet[0].address

    return web3
  }

  generateMnemonic(): string {
    let mnemonic = bip39.generateMnemonic()
    return mnemonic
  }

  getWeb3HttpProviderConnectionString(): string {
    let provider: string
    let transport: string = this.conf.web3Transport
    let network_id: string = this.conf.network_id

    provider = this.conf.httpWeb3provider + Secrets.ethereum[network_id].infura.api_key
    return provider
  }

  getWeb3TransportProvider(): Subprovider {
    let provider
    let web3Provider
    let transport = this.conf.web3Transport
    let network_id = this.conf.network_id
    switch (transport) {
      case 'WebSocket':
        provider = this.conf.websocketWeb3Provider
        web3Provider = new Web3.providers.WebsocketProvider(provider)
        break

      case 'HttpProvider':
        provider = this.conf.httpWeb3provider + Secrets.ethereum[network_id].infura.api_key
        web3Provider = new Web3.providers.HttpProvider(provider)
        break

      default:
        provider = this.conf.httpWeb3provider + Secrets.ethereum[network_id].infura.api_key
        web3Provider = new Web3.providers.HttpProvider(provider)
        break
    }

    return web3Provider
  }
}

export default SoftwareWalletProvider
