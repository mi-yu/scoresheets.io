import { combineReducers } from 'redux'
import userReducer from './userReducer'
import tournamentReducer from './tournamentReducer'
import eventReducer from './eventReducer'

export default combineReducers({
	users: userReducer,
	tournaments: tournamentReducer,
	events: eventReducer,
})
