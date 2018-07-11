import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import OpenModalButton from '../modals/OpenModalButton'
import options from './EventsOptions'
import Auth from '../../modules/Auth'
import { API_ROOT } from '../../config'
import {
	closeEventsModal,
	openEventsModal,
	setCurrentEvent,
	clearCurrentEvent,
	updateEvent,
	addEvent,
	setEditing,
} from '../../actions/eventActions'
import { setMessage } from '../../actions/messageActions'
import request from '../../modules/request'

class EventsModal extends React.Component {
	handleChange = (e, { name, value }) => {
		const { currentEvent, setCurrentEvent } = this.props
		setCurrentEvent({
			...currentEvent,
			[name]: value,
		})
	}

	handleCheck = (e, { name, checked }) => {
		const { currentEvent, setCurrentEvent } = this.props
		setCurrentEvent({
			...currentEvent,
			[name]: checked,
		})
	}

	handleSubmitEvent = () => {
		const {
			editing,
			currentEvent,
			closeEventsModal,
			updateEvent,
			clearCurrentEvent,
			setMessage,
			setEditing,
			addEvent,
		} = this.props
		const url = editing ? `${API_ROOT}/events/${currentEvent._id}` : '/events'
		const method = editing ? 'PATCH' : 'POST'
		const token = Auth.getToken()

		request(url, {
			method,
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			}),
			body: JSON.stringify(currentEvent),
		})
			.then(res => {
				if (editing) updateEvent(res)
				else addEvent(res)
				clearCurrentEvent()
				setEditing(false)
				closeEventsModal()
			})
			.catch(err => {
				setMessage(err.message, 'error')
			})
	}

	render() {
		const {
			modalOpen,
			currentEvent,
			clearCurrentEvent,
			openEventsModal,
			closeEventsModal,
		} = this.props

		return (
			<Modal
				trigger={
					<OpenModalButton
						onClick={() => {
							openEventsModal()
							clearCurrentEvent()
							setEditing(false)
						}}
						text="New Event"
						icon="plus"
					/>
				}
				closeIcon
				open={modalOpen}
				onClose={closeEventsModal}
			>
				<Modal.Header>
					{currentEvent.name ? `Edit Event: ${currentEvent.name}` : 'New Event'}
				</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field required>
							<label htmlFor="name">Name</label>
							<Form.Input
								required
								name="name"
								value={currentEvent.name}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label htmlFor="division">Division</label>
							<Dropdown
								placeholder="Select division"
								selection
								required
								name="division"
								options={options.divisions}
								defaultValue={currentEvent.division}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label htmlFor="category">Category</label>
							<Dropdown
								placeholder="Select category"
								selection
								required
								name="category"
								options={options.categories}
								defaultValue={currentEvent.category}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field>
							<label htmlFor="resources">
								Resources Allowed (1 binder, 4 sheets of paper, etc)
							</label>
							<Form.Input
								type="text"
								name="resources"
								value={currentEvent.resources}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Group inline>
							<Form.Checkbox
								name="inRotation"
								label="In rotation?"
								checked={currentEvent.inRotation}
								onChange={this.handleCheck}
							/>
							<Form.Checkbox
								name="impound"
								label="Requires impound?"
								checked={currentEvent.impound}
								onChange={this.handleCheck}
							/>
							<Form.Checkbox
								name="stateEvent"
								label="State/Trial event?"
								checked={currentEvent.stateEvent}
								onChange={this.handleCheck}
							/>
							<Form.Checkbox
								name="highScoreWins"
								label="High score wins?"
								checked={currentEvent.highScoreWins}
								onChange={this.handleCheck}
							/>
						</Form.Group>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={closeEventsModal}>Cancel</Button>
					<Button color="green" onClick={this.handleSubmitEvent}>
						Submit
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}

EventsModal.propTypes = {
	modalOpen: PropTypes.bool.isRequired,
	currentEvent: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		category: PropTypes.oneOf(['bio', 'earth', 'inquiry', 'phys/chem', 'building']),
		stateEvent: PropTypes.bool,
		impound: PropTypes.bool,
		division: PropTypes.oneOf(['B', 'C', 'BC']),
		setCurrentEvent: PropTypes.func,
	}).isRequired,
	clearCurrentEvent: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired,
	openEventsModal: PropTypes.func.isRequired,
	closeEventsModal: PropTypes.func.isRequired,
	setEditing: PropTypes.func.isRequired,
	addEvent: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	modalOpen: state.events.modalOpen,
	editing: state.events.editing,
	currentEvent: state.events.currentEvent,
})

const mapDispatchToProps = dispatch => ({
	setCurrentEvent: event => dispatch(setCurrentEvent(event)),
	clearCurrentEvent: () => dispatch(clearCurrentEvent()),
	updateEvent: event => dispatch(updateEvent(event)),
	addEvent: event => dispatch(addEvent(event)),
	openEventsModal: () => dispatch(openEventsModal()),
	closeEventsModal: () => dispatch(closeEventsModal()),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	setEditing: editing => dispatch(setEditing(editing)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(EventsModal)
