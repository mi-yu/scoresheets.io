const defaultState = {
	modalOpen: false,
	editing: false,
	currentTournament: {
		events: [],
	},
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
				currentTournament: action.payload || {
					events: [],
				},
			}
		}
		case 'CLEAR_CURRENT_TOURNAMENT':
			return {
				...state,
				currentTournament: {
					events: [],
				},
			}
		case 'SET_TOURNAMENT_EDITING':
			return {
				...state,
				editing: action.payload,
			}
		case 'UPDATE_TOURNAMENT': {
			const { tournamentList } = state
			const updatedTournament = action.payload
			const updatedList = tournamentList.map(tournament => {
				if (tournament._id === updatedTournament._id) return updatedTournament
				return tournament
			})
			return {
				...state,
				tournamentList: updatedList,
			}
		}
		case 'ADD_TOURNAMENT':
			return {
				...state,
				tournamentList: [action.payload, ...state.tournamentList],
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
