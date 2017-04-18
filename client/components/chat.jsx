import React, { Component } from 'react'
import {List, Segment, Divider, Button, Input} from 'semantic-ui-react'
import sock from '../helper/socket'
import escape from 'lodash.escape'
class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: props.name,
      messages: []
    }
    this.submitMessage = this.submitMessage.bind(this)
  }
  componentDidMount () {
    sock.socket.on('receive-game-message', (msgInfo) => {
      let messages = this.state.messages
      messages.push(msgInfo)
      this.setState({ messages: messages })
    })
  }

  submitMessage () {
    let message = escape(document.getElementById('chatBox').value)
    console.log(message)
    document.getElementById('chatBox').value = ''
    let sender = this.state.name
    let room = this.props.gameID
    let msgInfo = {sender: sender, message: message, room: room}

    JSON.stringify(msgInfo)
    sock.socket.emit('new-game-message', escape(msgInfo))
  }

  render () {
    let messages = this.state.messages.map((msg, i) => {
      return <li key={i}>{msg.sender}: {msg.message}</li>
    })
    return (
      <Segment vertical compact className='content'>
        <Divider />
        <List items={messages} />
        <input id='chatBox' name='chatBox' type='text' />
        <Button size='mini' onClick={this.submitMessage}>Send</Button>
      </Segment>
    )
  }
}

Chat.propTypes = {
  name: React.PropTypes.string.isRequired
}

export default Chat
