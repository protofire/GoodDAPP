// @flow
import axios from 'axios'
import { AsyncStorage } from 'react-native'
import type { Credentials } from '../API/api'
import API from '../API/api'

class LoginService {
  credentials: ?Credentials

  jwt: ?string

  toSign: string = 'Login to GoodDAPP'

  constructor() {
    this.getJWT().then(jwt => (this.jwt = jwt))
    this.getCredentials().then(c => (this.credentials = c))
  }

  storeCredentials(creds: Credentials) {
    if (!creds) return
    this.credentials = creds
    AsyncStorage.setItem('GoodDAPP_creds', JSON.stringify(this.credentials))
  }

  // eslint-disable-next-line class-methods-use-this
  storeJWT(jwt: string) {
    this.jwt = jwt
    if (jwt) AsyncStorage.setItem('GoodDAPP_jwt', jwt)
  }

  async getCredentials(): Promise<?Credentials> {
    const data = await AsyncStorage.getItem('GoodDAPP_creds')
    return data ? JSON.parse(data) : null
  }

  // eslint-disable-next-line class-methods-use-this
  async getJWT(): Promise<?string> {
    return AsyncStorage.getItem('GoodDAPP_jwt')
  }

  // eslint-disable-next-line class-methods-use-this
  async login(): Promise<Credentials> {
    throw new Error('Method not implemented')
  }

  async auth(): Promise<?Credentials | Error> {
    if (this.credentials && this.jwt) {
      console.log('Got existing credentials', this.credentials)
      return Promise.resolve(this.credentials)
    }

    const creds = await this.login()
    console.log('signed message')
    this.storeCredentials(creds)
    console.log('stored creds')

    // TODO: write the nonce https://gitlab.com/gooddollar/gooddapp/issues/1
    console.log('Calling server for authentication')
    const authResult: Credentials | Error = API.auth(creds)
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          const data = res.data
          creds.jwt = data.token
          this.storeJWT(data.token)
          console.debug('Login success:', data)
          return creds
        }
        throw new Error(res.statusText)
      })
      .catch((e: Error) => {
        console.error('Login service auth failed:', e)
        return e
      })
    return authResult
  }

  // async testAuth():Promise<boolean> {
  //   const authResult = await fetchPromise.then(fetch => fetch(`${window.location.origin}/auth/test`, {
  //     headers: { Authorization: `Bearer ${this.jwt || ""}` }
  //   })
  //     .then(async (res) => {
  //       if (res.status === 200) { console.debug("success"); return false; }
  //       throw new Error("Unauthorized")
  //     })
  //     .catch((e:Error) => {
  //       console.error("failure", e)
  //       return false
  //     }))
  //   const res = await authResult
  //   return res
  // }
}

export default LoginService
