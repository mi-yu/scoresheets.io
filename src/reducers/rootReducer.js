import { combineReducers } from 'redux'
import userReducer from './userReducer'
import tournamentReducer from './tournamentReducer'
import eventReducer from './eventReducer'
import messageReducer from './messageReducer'
import teamReducer from './teamReducer'

export default combineReducers({
	users: userReducer,
	tournaments: tournamentReducer,
	events: eventReducer,
	messages: messageReducer,
	teams: teamReducer,
})
