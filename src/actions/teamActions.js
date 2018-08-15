export const showConfirmDeleteModal = () => dispatch => {
	dispatch({
		type: 'SHOW_CONFIRM_DELETE_MODAL',
	})
}

export const hideConfirmDeleteModal = () => dispatch => {
	dispatch({
		type: 'HIDE_CONFIRM_DELETE_MODAL',
	})
}

export const showEditCreateModal = () => dispatch => {
	dispatch({
		type: 'SHOW_EDIT_CREATE_MODAL',
	})
}

export const hideEditCreateModal = () => dispatch => {
	dispatch({
		type: 'HIDE_EDIT_CREATE_MODAL',
	})
}

export const setCurrentTeam = (teamId) => dispatch => {
	dispatch({
		type: 'SET_CURRENT_TEAM',
		payload: teamId,
	})
}

export const setEditingTeam = (editing) => dispatch => {
	dispatch({
		type: 'SET_EDITING_TEAM',
		payload: editing,
	})
}
