const defaultState = {
	currentUser: {},
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_USER': {
			return {
				...state,
				currentUser: action.payload,
			}
		}
		default:
			return state
	}
}
