export const setMessage = (message, type) => dispatch => {
	dispatch({
		type: 'SET_MESSAGE',
		payload: {
			message,
			type,
		},
	})
}

export const showMessage = () => dispatch => {
	dispatch({
		type: 'SHOW_MESSAGE',
	})
}

export const hideMessage = () => dispatch => {
	dispatch({
		type: 'HIDE_MESSAGE',
	})
}
