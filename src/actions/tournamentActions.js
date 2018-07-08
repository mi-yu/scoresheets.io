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

export const updateTournament = tournament => dispatch => {
	dispatch({
		type: 'UPDATE_TOURNAMENT',
		payload: tournament,
	})
}

export const setCurrentTournament = tournament => dispatch => {
	dispatch({
		type: 'SET_CURRENT_TOURNAMENT',
		payload: tournament,
	})
}

export const setEditing = editing => dispatch => {
	dispatch({
		type: 'SET_TOURNAMENT_EDITING',
		payload: editing,
	})
}

export const clearCurrentTournament = () => dispatch => {
	dispatch({
		type: 'CLEAR_CURRENT_TOURNAMENT',
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
