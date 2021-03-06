// @flow
import React from 'react'
import { View } from 'react-native'
import { Button, TextInput, IconButton } from 'react-native-paper'
import isEmail from 'validator/lib/isEmail'
import { BackButton, ContinueButton, Wrapper } from './components'

type Props = {
  // callback to report to parent component
  doneCallback: ({ email: string }) => null
}
type State = {
  email: string,
  valid?: boolean
}
export default class EmailForm extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      email: this.props.screenProps.data.email || '',
      valid: false
    }
    this.state.valid = isEmail(this.state.email)
  }
  componentDidMount() {
    this.focusInput()
  }

  focusInput() {
    if (window.Keyboard && window.Keyboard.show) {
      window.Keyboard.show()
    }
  }

  handleChange = text => {
    this.setState({
      email: text,
      valid: isEmail(text)
    })
  }

  handleSubmit = () => {
    this.props.screenProps.doneCallback({ email: this.state.email })
  }

  render() {
    // const MIcon = (<Icon name="rocket" size={30} color="#900" />)
    console.log(this.props.navigation)
    return (
      <Wrapper>
        {/* Your screen contents depending on current tab. */}
        <TextInput
          id="signup_email"
          label="Your Email"
          value={this.state.email}
          onChangeText={this.handleChange}
          keyboardType="email-address"
          autoFocus
        />
        <ContinueButton valid={this.state.valid} handleSubmit={this.handleSubmit} />
        <BackButton {...this.props.screenProps} />
      </Wrapper>
    )
  }
}
