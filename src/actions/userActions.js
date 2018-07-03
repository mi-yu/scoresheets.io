export const setUser = user => dispatch => {
	console.log('in set user')
	dispatch({
		type: 'SET_USER',
		payload: user,
	})
}
