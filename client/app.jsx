import React, { Component } from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import Board from './components/board'
import Land from './components/landing'
import Signup from './components/signup'

class App extends Component {
  render () {
    return (
      <Router>
        <div>
          {console.log('here')}
          <Route exact path='/' component={Land} />
          <Route path='/board' component={Board} />
          <Route path='/signup' component={Signup} />
        </div>
      </Router>
    )
  }
}

render(<App />, document.getElementById('container'))
