export default (state = {}, action) => {
	switch (action.type) {
		case 'SET_EVENTS':
			return {
				...state,
				eventList: action.payload,
			}
		case 'SET_CURRENT_EVENT':
			return {
				...state,
				currentEvent: action.payload,
			}
		case 'ADD_EVENT':
			return {
				...state,
				eventList: [...state.eventList, action.payload],
			}
		case 'UPDATE_EVENT': {
			const { eventList } = state
			const updatedEvent = action.payload
			const updatedList = eventList.map(event => {
				if (event._id === updatedEvent._id) return updatedEvent
				return event
			})
			return {
				...state,
				eventList: updatedList,
			}
		}
		case 'REMOVE_EVENT': {
			const { eventList } = state
			const removedEvent = action.payload
			const updatedList = eventList.filter(event => event._id !== removedEvent._id)
			return {
				...state,
				eventList: updatedList,
			}
		}
		default:
			return state
	}
}
