const defaultState = {
	message: '',
	type: 'info',
	visible: false,
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_MESSAGE':
			return {
				...state,
				message: action.payload.message,
				type: action.payload.type,
				visible: true,
			}
		case 'SHOW_MESSAGE':
			return {
				...state,
				visible: true,
			}
		case 'HIDE_MESSAGE':
			return {
				...state,
				visible: false,
			}
		default:
			return state
	}
}
