// @flow
import axios from 'axios'
import Config from '../../config/dev.js'
import { AsyncStorage } from 'react-native'

export type Credentials = {
  publicKey: string,
  signature: string,
  jwt?: string
}

export type UserRecord = {
  pubkey: string,
  fullName?: string,
  mobile?: string,
  email?: string,
  jwt?: string
}

class API {
  jwt: string
  client: axios

  constructor() {
    this.init()
  }

  init() {
    console.log('initializing api...')
    AsyncStorage.getItem('GoodDAPP_jwt').then(async jwt => {
      this.jwt = jwt
      this.client = await axios.create({
        baseURL: Config.GoodServer,
        timeout: 2000,
        headers: { Authorization: `Bearer ${this.jwt || ''}` }
      })
      console.log('API ready', this.client, this.jwt)
    })
  }
  auth(creds: Credentials) {
    return this.client.post(`/auth/eth`, creds)
  }

  async addUser(user: UserRecord) {
    try {
      let res = await this.client.post('/user/add', { user })
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }
}

export default new API()
