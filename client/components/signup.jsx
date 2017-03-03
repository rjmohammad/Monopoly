import React, { Component } from 'react'
import { Button, Header, Container, Segment, Input, Icon, Divider, Form } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Authenticate from '../helper/authenticate'
class Signup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      displayName: '',
      valid: false
    }
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onDisplayChange = this.onDisplayChange.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
  }

  componentDidMount () {
    let video = document.getElementById('monoSignup')
    video.addEventListener('canplay', () => {
      video.play()
    })
  }

  onEmailChange (e) {
    this.setState({ email: e.target.value })
  }

  onPasswordChange (e) {
    this.setState({ password: e.target.value })
  }

  onDisplayChange (e) {
    this.setState({ displayName: e.target.value })
  }

  handleSignup (e) {
    e.preventDefault()
    axios.post('/signup', this.state)
      .then((res) => {
        window.localStorage.setItem('token', res.data.token)
        window.localStorage.setItem('displayname', res.data.user.displayname)
        window.localStorage.setItem('id', res.data.user.id)
        this.setState({ valid: true })
      })
      .catch((err) => console.error(err))
  }

  render () {
    return (
      <div>
        <Container className='landingForm'>
          <Segment vertical compact>
            <Header as='h1' icon textAlign='center'>
              <Icon name='users' circular />
              <Header.Content>
                Signup
              </Header.Content>
            </Header>
            <Form onSubmit={this.handleSignup}>
              <Input focus fluid name='email' type='email' placeholder='Email' onChange={this.onEmailChange} />
              <Divider horizontal />
              <Input focus fluid name='displayName' placeholder='Display Name' onChange={this.onDisplayChange} />
              <Divider horizontal />
              <Input focus fluid name='password' placeholder='Password' type='password' onChange={this.onPasswordChange} />
              <Divider horizontal />
              <Button secondary fluid type='submit'>Sign Up</Button>
            </Form>
            <Divider horizontal />
          </Segment>
          {
            this.state.valid ? Authenticate.isAuth() ? <Redirect to={{ pathname: '/lobby' }} /> : <Redirect to={{ pathname: '/' }} /> : null
          }
        </Container>
        <video id='monoSignup' className='video' loop>
          <source src='mono.mp4' type='video/mp4' />
          <source src='mono.ogv' type='video/ogg' />
          <source src='mono.webm' type='video/webm' />
        </video>
      </div>
    )
  }
}

export default Signup
