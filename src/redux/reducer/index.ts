import { combineReducers } from 'redux'
import pwdReducer from './pwd'
import menuReducer from './menu'
import countReducer from './count'

export default combineReducers({
  pwdReducer,
  menuReducer,
  countReducer,
})
