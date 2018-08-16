import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form, Dropdown, Icon } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import OpenModalButton from '../modals/OpenModalButton'
import Auth from '../../modules/Auth'
import states from './StatesList'
import { API_ROOT } from '../../config'
import {
	closeTournamentsModal,
	openTournamentsModal,
	setCurrentTournament,
	clearCurrentTournament,
	updateTournament,
	setEditing,
	addTournament,
} from '../../actions/tournamentActions'
import { setMessage } from '../../actions/messageActions'
import request from '../../modules/request'

class TournamentsModal extends React.Component {
	handleChange = (e, { name, value }) => {
		const { currentTournament, setCurrentTournament } = this.props
		setCurrentTournament({
			...currentTournament,
			[name]: value,
		})
	}

	handleCheck = (e, { name, checked }) => {
		const { currentTournament, setCurrentTournament } = this.props
		setCurrentTournament({
			...currentTournament,
			[name]: checked,
		})
	}

	handleSubmitEvent = () => {
		const {
			editing,
			currentTournament,
			setMessage,
			closeTournamentsModal,
			updateTournament,
			clearCurrentTournament,
			setEditing,
			addTournament,
		} = this.props
		const url = editing
			? `${API_ROOT}/tournaments/${currentTournament._id}`
			: `${API_ROOT}/tournaments`
		const method = editing ? 'PATCH' : 'POST'
		const token = Auth.getToken()

		request(url, {
			method,
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			}),
			body: JSON.stringify(currentTournament),
		})
			.then(res => {
				if (editing) updateTournament(res)
				else addTournament(res)
				clearCurrentTournament()
				setEditing(false)
				closeTournamentsModal()
			})
			.catch(err => {
				closeTournamentsModal()
				setMessage(err.message, 'error')
			})
	}

	handleQuickAddEvent = key => {
		const { events, currentTournament, setCurrentTournament } = this.props
		const eventKeys = Object.keys(events)
		let newEvents = eventKeys
		switch (key) {
			case 0: // only B events
				newEvents = eventKeys.filter(
					id => events[id].division.includes('B') && !events[id].stateEvent,
				)
				break
			case 1: // only C events
				newEvents = eventKeys.filter(
					id => events[id].division.includes('C') && !events[id].stateEvent,
				)
				break
			case 2: // B events + trials
				newEvents = eventKeys.filter(id => events[id].division.includes('B'))
				break
			case 3: // C events + trials
				newEvents = eventKeys.filter(id => events[id].division.includes('C'))
				break
			case 4: // only B/C events
				newEvents = eventKeys.filter(id => !events[id].stateEvent)
				break
			case 5:
			default:
				break
		}

		setCurrentTournament({
			...currentTournament,
			events: newEvents,
		})
	}

	sortTournamentEvents = (tournamentEvents) => {
		const { events } = this.props
		if (!tournamentEvents) return null
		return tournamentEvents.sort((idA, idB) => events[idA].name.localeCompare(events[idB].name))
	}

	render() {
		let eventsOptions = []

		const {
			events,
			modalOpen,
			openTournamentsModal,
			clearCurrentTournament,
			closeTournamentsModal,
			currentTournament,
			setEditing,
		} = this.props

		if (events) {
			eventsOptions = Object.keys(events).map(id => ({ text: events[id].name, value: id }))
		} else {
			return <Redirect to="/admin/dashboard" />
		}

		return (
			<Modal
				trigger={(
					<OpenModalButton
						onClick={() => {
							openTournamentsModal()
							clearCurrentTournament()
							setEditing(false)
						}}
						text="New Tournament"
						icon="plus"
					/>
				)}
				closeIcon
				open={modalOpen}
				onClose={closeTournamentsModal}
			>
				<Modal.Header>
					{currentTournament.name
						? `Edit Tournament: ${currentTournament.name}`
						: 'New Tournament'}
				</Modal.Header>
				<Modal.Content scrolling>
					<Form>
						<Form.Field required>
							<label htmlFor="name">Tournament Name</label>
							<Form.Input
								required
								name="name"
								value={currentTournament.name}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label htmlFor="city">City</label>
							<Form.Input
								required
								name="city"
								value={currentTournament.city}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label htmlFor="state">State</label>
							<Dropdown
								placeholder="Select state"
								selection
								search
								name="state"
								options={states}
								defaultValue={currentTournament.state}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label htmlFor="date">Date</label>
							<Form.Input type="date" name="date" onChange={this.handleChange} />
						</Form.Field>
						<Form.Field required>
							<label htmlFor="events">Events</label>
							<Dropdown
								placeholder="Choose events"
								selection
								multiple
								search
								name="events"
								options={eventsOptions}
								value={this.sortTournamentEvents(currentTournament.events)}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(0)}
							>
								<Icon name="plus" />
								B events (no trials)
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(1)}
							>
								<Icon name="plus" />
								C events (no trials)
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(2)}
							>
								<Icon name="plus" />
								B events + trials
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(3)}
							>
								<Icon name="plus" />
								C events + trials
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(4)}
							>
								<Icon name="plus" />
								B/C events (no trials)
							</Button>
							<Button
								icon
								size="tiny"
								color="teal"
								onClick={() => this.handleQuickAddEvent(5)}
							>
								<Icon name="plus" />
								B/C events + trials
							</Button>
						</Form.Field>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={closeTournamentsModal}>Cancel</Button>
					<Button color="green" onClick={this.handleSubmitEvent}>
						Submit
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}

TournamentsModal.propTypes = {
	modalOpen: PropTypes.bool.isRequired,
	currentTournament: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		city: PropTypes.string,
		state: PropTypes.string,
		date: PropTypes.string,
		events: PropTypes.arrayOf(PropTypes.string),
	}).isRequired,
	setCurrentTournament: PropTypes.func.isRequired,
	openTournamentsModal: PropTypes.func.isRequired,
	closeTournamentsModal: PropTypes.func.isRequired,
	updateTournament: PropTypes.func.isRequired,
	addTournament: PropTypes.func.isRequired,
	setEditing: PropTypes.func.isRequired,
	clearCurrentTournament: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired,
	events: PropTypes.arrayOf(PropTypes.object).isRequired,
	editing: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
	modalOpen: state.tournaments.modalOpen,
	editing: state.tournaments.editing,
	currentTournament: state.tournaments.currentTournament,
	events: state.events.eventList,
})

const mapDispatchToProps = dispatch => ({
	openTournamentsModal: () => dispatch(openTournamentsModal()),
	closeTournamentsModal: () => dispatch(closeTournamentsModal()),
	setCurrentTournament: tournament => dispatch(setCurrentTournament(tournament)),
	clearCurrentTournament: () => dispatch(clearCurrentTournament()),
	addTournament: tournament => dispatch(addTournament(tournament)),
	updateTournament: tournament => dispatch(updateTournament(tournament)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	setEditing: editing => dispatch(setEditing(editing)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TournamentsModal)
