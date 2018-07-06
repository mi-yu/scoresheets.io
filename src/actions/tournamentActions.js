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

export const setCurrentTournament = tournamentId => dispatch => {
	dispatch({
		type: 'SET_CURRENT_TOURNAMENT',
		payload: tournamentId,
	})
}

export const openTournamentsModal = () => dispatch => {
	dispatch({
		type: 'OPEN_TOURNAMENTS_MODAL',
	})
}

export const closeTournamentsModal = () => dispatch => {
	dispatch({
		type: 'CLOSE_TOURNAMENTS_MODAL',
	})
}