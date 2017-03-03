import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import sock from '../helper/socket'
import { connect } from 'react-redux'
import { setUsername, setGameID, setUserID, setMyIndex, setDefaultState, setState } from './store/actionCreators'
import Toast from './toast'
import axios from 'axios'
import LoadGame from './LoadGame'
import { Button } from 'semantic-ui-react'
import { Motion, spring, TransitionMotion } from 'react-motion'
const springPreset = { wobbly: [130, 11] }
class Lobby extends Component {
  constructor (props) {
    super(props)
    this.state = {
      button: false,
      join: false,
      start: false,
      messages: [],
      showToast: false,
      comment: '',
      queryResults: [],
      pendingGames: [],
      resume: true,
      games: {}
    }
    this.props.dispatch(setDefaultState())
    this.props.dispatch(setUsername(window.localStorage.displayname))
    this.props.dispatch(setUserID(window.localStorage.id))
    sock.userJoined({ id: window.localStorage.id, displayName: window.localStorage.displayname })

    this.joinGame = this.joinGame.bind(this)
    this.newGame = this.newGame.bind(this)
    this.startGame = this.startGame.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
    this.getChats = this.getChats.bind(this)
    this.signOut = this.signOut.bind(this)
  }
  componentDidMount () {
    // window.localStorage.removeItem('state')
    sock.socket.on('get games', (data) => {
      this.setState({games: data.newGames})
    })
    sock.socket.on('new game', (data) => {
      console.log(data)
      this.setState({games: data.newGame})
      // this.setState({ join: true })
      // window.localStorage.setItem('gameID', data.gameID)
      // this.props.dispatch(setGameID(data.gameID))
    })
    sock.socket.on('pending games', (pendingGames) => {
      this.setState({ pendingGames })
    })

    sock.socket.on('your index', (data) => {
      this.props.dispatch(setMyIndex(data))
    })

    sock.socket.on('player joined', (data) => {
      this.setState({
        join: false,
        start: true,
        showToast: true,
        comment: 'Player joined'
      })
      this.setState({
      })
      this.props.dispatch(setGameID(data.gameID))
    })
    sock.socket.on('player started', (data) => {
      this.setState({
        join: false,
        start: true
      })
    })
    sock.socket.on('send message', (data) => {
      this.setState({})
    })
    sock.socket.on('receive-message', (msgInfo) => {
      let messages = [...this.state.messages]
      messages.push(msgInfo)
      this.setState({ messages })
    })
    sock.socket.on('load state', (state) => {
      this.props.dispatch(setState(state))
      this.setState({ resume: false })
    })
  }
  newGame () {
    sock.newGame({ username: this.props.username, userID: this.props.userID, picture: window.localStorage.picture })
  }

  joinGame () {
    this.stateState({join: false})
    sock.join({ username: this.props.username, userID: this.props.userID, gameID: this.props.gameID, picture: window.localStorage.picture })
  }

  startGame () {
    sock.start({ gameID: this.props.gameID })
  }

  submitMessage () {
    let message = document.getElementById('message').value
    document.getElementById('message').value = ''
    let sender = this.props.username
    let room = 'lobby'
    let msgInfo = { sender: sender, message: message, room: room }
    JSON.stringify(msgInfo)
    sock.socket.emit('new-message', msgInfo)
  }

  handleGameClick (gameID) {
    this.setState({join: true})
    this.props.dispatch(setGameID(gameID))
    window.localStorage.setItem('gameID', gameID)
  }

  getChats (e) {
    e.preventDefault()
    let room = document.getElementById('room').value
    let keyword = document.getElementById('keyword').value
    let date = document.getElementById('date').value
    document.getElementById('keyword').value = ''
    axios.post('/chats', { room: room, keyword: keyword, date: date })
      .then((res) => {
        this.setState({ queryResults: res.data })
      })
      .catch((err) => console.error(err))
  }

  signOut () {
    console.log('sign out called')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('displayname')
    window.localStorage.removeItem('id')
    this.setState({ promise: false })
  }

  getStyles () {
    let configs = {}
    this.state.messages.forEach((val, index) => {
      console.log(val, index)
      configs[val._id] = {
        opacity: spring(1),
        top: spring(0, springPreset.wobbly)
      }
    })
    return configs
  }

  willEnter (key) {
    return {
      opacity: spring(0),
      top: spring(100, springPreset.wobbly)
    }
  }

  render () {
    // let messages = this.state.messages.map((msg, i) => {
    //   return <li className='oneChat' key={i}> <strong>{msg.sender}</strong>: {msg.message}</li>
    // })
    console.log(this.getStyles())
    let queryResults = this.state.queryResults.map((result) => {
      return <li>Sender: {result.sender} Message: {result.message} Room: {result.room}</li>
    })
    return (
      <div>
        <nav className='navbar navbar-default navbar-fixed-top'>
          <div className='container'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' aria-expanded='false' aria-controls='navbar'>
                <span className='sr-only'>Toggle navigation</span>
                <span className='icon-bar' />
                <span className='icon-bar' />
                <span className='icon-bar' />
              </button>
              <a className='navbar-brand' href='#/'>Hacknopoly</a>
            </div>
            <div id='navbar' className='collapse navbar-collapse'>
              <ul className='nav navbar-nav'>
                <li><a href='/'>Home</a></li>
                <li><a href='/'>Profile</a></li>
              </ul>
              <span>Welcome {this.props.username}</span>
              <div>
                <Link to='/'><button onClick={this.signOut}>Sign Out </button></Link>
              </div>
            </div>
          </div>
        </nav>

        <div className='container' id='lobby'>
          <div className='row'>
            <div className='col-md-9'>
              <div className='panel panel-primary chatWindow'>
                <div className='panel-heading'>
                  <span className='glyphicon glyphicon-comment' /> Chat
                </div>
                <div className='panel-body'>
                  <TransitionMotion
                    styles={this.getStyles()}
                    willEnter={this.willEnter}
                    willLeave={this.willLeave}>
                    {interp =>
                      <div className='comment-list'>
                        {this.state.messages.map((comment, i) => {
                          const {...style} = interp[i + 1]
                          return (
                            <div className='comment-node' sender={comment.sender} key={comment._id} style={style}>
                              <div className='print-author'>
                                {comment.sender + ' - '}
                              </div>
                              {comment.message}
                            </div>
                          )
                        })}
                      </div>
                    }
                  </TransitionMotion>

                </div>

                <div className='panel-footer'>
                  <div className='input-group'>
                    <input id='message' type='text' className='form-control input-sm' placeholder='Enter your message...' />
                    <span className='input-group-btn'>
                      <button className='btn btn-warning btn-sm' onClick={this.submitMessage}>Send</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='panel panel-primary onlinePlayers'>
                <div className='panel-heading'> Online Players </div>
              </div>
              <div className='panel panel-primary gameList'>
                <div className='panel-heading'> Game List </div>
                <LoadGame pendingGames={this.state.pendingGames} load={this.state.resume} />
              </div>
              <div className='gameButton'>
                <div>
                  <Button color='teal' size='massive' onClick={this.newGame}> New Game </Button>
                  {Object.keys(this.state.games).map((item) => {
                    return <div onClick={() => { this.handleGameClick(this.state.games[item]) }}>Game: {item}</div>
                  })}
                  {this.state.join ? <Button color='teal' size='massive' onClick={this.joinGame}> Join Game </Button> : null}
                  {this.state.start ? <Link to='/board'><button color='teal' size='massive' onClick={this.startGame}> Start Game </button></Link> : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toast message={this.state.comment} show={this.state.showToast} />
        <br />
        <div>
          <form onSubmit={this.getChats}>
            <input type='text' placeholder='keyword' id='keyword' />
            <select id='room' name='room'>
              <option>All Rooms</option>
              <option value='lobby'>Lobby</option>
              <option value='board'>Board</option>
            </select>

            <select id='date'>
              <option>This Week</option>
              <option value='thisWeek'>This Month</option>
              <option value='thisYear'>This Year</option>
            </select>
            <button type='submit'>Show chats</button>
          </form>
          <p> You have total of {this.state.queryResults.length} messages </p>
          <ul>
            {queryResults}
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    gameID: state.gameID,
    userID: state.userID,
    messageID: state.messageID
  }
}
Lobby.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  gameID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.string.isRequired,
  messageID: React.PropTypes.number.isRequired
}
export default connect(mapStateToProps)(Lobby)
