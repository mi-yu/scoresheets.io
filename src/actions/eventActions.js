export const setEvents = events => dispatch => {
	dispatch({
		type: 'SET_EVENTS',
		payload: events,
	})
}

export const setCurrentEvent = event => dispatch => {
	dispatch({
		type: 'SET_CURRENT_EVENT',
		payload: event,
	})
}

export const updateEvent = event => dispatch => {
	dispatch({
		type: 'UPDATE_EVENT',
		payload: event,
	})
}

export const addEvent = event => dispatch => {
	dispatch({
		type: 'ADD_EVENT',
		payload: event,
	})
}

export const removeEvent = event => dispatch => {
	dispatch({
		type: 'REMOVE_EVENT',
		payload: event,
	})
}
