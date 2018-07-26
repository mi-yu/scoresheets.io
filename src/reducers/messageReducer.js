const defaultState = {
	message: '',
	type: 'info',
	visible: false,
	details: [],
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_MESSAGE':
			return {
				...state,
				message: action.payload.message,
				type: action.payload.type,
				details: action.payload.details,
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
