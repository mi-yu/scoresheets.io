const defaultState = {
	confirmDeleteModalOpen: false,
	editCreateModalOpen: false,
	editing: false,
	currentTeamId: '',
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'SHOW_CONFIRM_DELETE_MODAL':
			return {
				...state,
				confirmDeleteModalOpen: true,
			}
		case 'HIDE_CONFIRM_DELETE_MODAL':
			return {
				...state,
				confirmDeleteModalOpen: false,
			}
		case 'SHOW_EDIT_CREATE_MODAL':
			return {
				...state,
				editCreateModalOpen: true,
			}
		case 'HIDE_EDIT_CREATE_MODAL':
			return {
				...state,
				editCreateModalOpen: false,
			}
		case 'SET_EDITING_TEAM':
			return {
				...state,
				editing: action.payload,
			}
		case 'SET_CURRENT_TEAM':
			return {
				...state,
				currentTeamId: action.payload,
			}
		default:
			return state
	}
}
