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

export const clearCurrentEvent = () => dispatch => {
	dispatch({
		type: 'CLEAR_CURRENT_EVENT',
	})
}

export const setEditing = editing => dispatch => {
	dispatch({
		type: 'SET_EVENT_EDITING',
		payload: editing,
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

export const openEventsModal = () => dispatch => {
	dispatch({
		type: 'OPEN_EVENTS_MODAL',
	})
}

export const closeEventsModal = () => dispatch => {
	dispatch({
		type: 'CLOSE_EVENTS_MODAL',
	})
}
