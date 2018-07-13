const defaultState = {
	modalOpen: false,
	editing: false,
	currentEvent: {},
	eventList: {},
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_EVENTS':
			return {
				...state,
				eventList: action.payload,
			}
		case 'SET_CURRENT_EVENT': {
			return {
				...state,
				currentEvent: action.payload || {},
			}
		}
		case 'CLEAR_CURRENT_EVENT':
			return {
				...state,
				currentEvent: {},
			}
		case 'SET_EVENT_EDITING':
			return {
				...state,
				editing: action.payload,
			}
		case 'ADD_EVENT':
			return {
				...state,
				eventList: {
					...state.eventList,
					[action.payload._id]: action.payload,
				},
			}
		case 'UPDATE_EVENT': {
			const { eventList } = state
			const updatedEvent = action.payload
			const updatedList = {
				...eventList,
				[updatedEvent._id]: updatedEvent,
			}
			return {
				...state,
				eventList: updatedList,
			}
		}
		case 'REMOVE_EVENT': {
			const { eventList } = state
			const removedEvent = action.payload
			const { [removedEvent._id]: val, rest } = eventList
			return {
				...state,
				eventList: rest,
			}
		}
		case 'OPEN_EVENTS_MODAL':
			return {
				...state,
				modalOpen: true,
			}
		case 'CLOSE_EVENTS_MODAL':
			return {
				...state,
				modalOpen: false,
			}
		default:
			return state
	}
}
