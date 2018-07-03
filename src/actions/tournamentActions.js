export const setTournaments = tournaments => dispatch => {
	dispatch({
		type: 'SET_TOURNAMENTS',
		payload: tournaments,
	})
}

export const addTournament = tournament => dispatch => {
	dispatch({
		type: 'ADD_TOURNAMENT',
		payload: tournament,
	})
}
