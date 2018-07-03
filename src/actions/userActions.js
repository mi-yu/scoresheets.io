export const setUser = user => dispatch => {
	dispatch({
		type: 'SET_USER',
		payload: user,
	})
}
