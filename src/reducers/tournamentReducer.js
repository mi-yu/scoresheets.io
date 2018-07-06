const defaultState = {
	modalOpen: false,
	editing: false,
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_TOURNAMENTS':
			return {
				...state,
				tournamentList: action.payload,
			}
		case 'SET_CURRENT_TOURNAMENT':
			{
				const {
					tournamentList
				} = state
				const nextCurrentTournament =
					tournamentList &&
					tournamentList.filter(tournament => tournament._id === action.payload)
				return {
					...state,
					currentTournament: nextCurrentTournament || {},
					editing: state.tournamentList && state.tournamentList.includes(action.payload),
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