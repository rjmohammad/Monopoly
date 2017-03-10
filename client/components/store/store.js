import { createStore } from 'redux'
import rootReducer from './reducers'
import { saveState, loadState } from './localStorage'
import { saveRemoteState } from './remoteStorage'
import throttle from 'lodash/throttle'

const presistedState = loadState()
const store = createStore(
  rootReducer,
  presistedState
  )
store.subscribe(() => {
  saveState(store.getState())
})

store.subscribe(throttle(() => {
  saveRemoteState(store.getState())
}), 1000)

export default store
