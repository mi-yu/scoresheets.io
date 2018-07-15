export const setMessage = (message, type) => dispatch => {
	dispatch({
		type: 'SET_MESSAGE',
		payload: {
			message,
			type,
		},
	})

	// Hide message automatically after 5 seconds
	setTimeout(() => {
		dispatch({
			type: 'HIDE_MESSAGE',
		})
	}, 5000)
}

export const showMessage = () => dispatch => {
	dispatch({
		type: 'SHOW_MESSAGE',
	})

	// Hide message automatically after 5 seconds
	setTimeout(() => {
		dispatch({
			type: 'HIDE_MESSAGE',
		})
	}, 5000)
}

export const hideMessage = () => dispatch => {
	dispatch({
		type: 'HIDE_MESSAGE',
	})
}
