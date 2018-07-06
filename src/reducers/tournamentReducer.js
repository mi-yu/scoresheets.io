const defaultState = {
	modalOpen: false,
	editing: false,
	currentTournament: {},
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_TOURNAMENTS':
			return {
				...state,
				tournamentList: action.payload,
			}
		case 'SET_CURRENT_TOURNAMENT': {
			return {
				...state,
				currentTournament: action.payload || {},
				editing: action.payload,
			}
		}
		case 'ADD_TOURNAMENT':
			return {
				...state,
				tournamentList: [...state.tournamentList, action.payload],
			}
		case 'OPEN_TOURNAMENTS_MODAL':
			return {
				...state,
				modalOpen: true,
			}
		case 'CLOSE_TOURNAMENTS_MODAL':
			return {
				...state,
				modalOpen: false,
			}
		default:
			return state
	}
}
