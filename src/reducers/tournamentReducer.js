export default (state = {}, action) => {
	switch (action.type) {
		case 'SET_TOURNAMENTS':
			return {
				...state,
				tournamentList: action.payload,
			}
		case 'ADD_TOURNAMENT':
			return {
				...state,
				tournamentList: [...state.tournamentList, action.payload],
			}
		default:
			return state
	}
}
