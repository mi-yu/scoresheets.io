const defaultState = {
	modalOpen: false,
	editing: false,
	currentTournament: {},
	tournamentList: {},
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
			const updatedList = {
				...tournamentList,
				[updatedTournament._id]: updatedTournament,
			}

			return {
				...state,
				tournamentList: updatedList,
			}
		}
		case 'ADD_TOURNAMENT':
			return {
				...state,
				tournamentList: {
					...state.tournamentList,
					[action.payload._id]: action.payload,
				},
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
		case 'ADD_TEAM': {
			const { currentTournament } = state
			const sortByTeamNumber = (a, b) => a.teamNumber - b.teamNumber
			const newTeams = [currentTournament.teams, action.payload].sort(sortByTeamNumber)

			return {
				...state,
				currentTournament: {
					...currentTournament,
					teams: newTeams,
				},
			}
		}
		case 'REMOVE_TEAM': {
			const { currentTournament } = state
			const filteredTeams = currentTournament.teams.filter(team => team._id !== action.payload)

			return {
				...state,
				currentTournament: {
					...currentTournament,
					teams: filteredTeams,
				},
			}
		}
		case 'UPDATE_TEAM': {
			const { currentTournament } = state
			const mapTeamById = team => (team._id === action.payload._id ? action.payload : team)
			const updatedTeams = currentTournament.teams.map(mapTeamById)

			return {
				...state,
				currentTournament: {
					...currentTournament,
					teams: updatedTeams,
				},
			}
		}
		default:
			return state
	}
}
