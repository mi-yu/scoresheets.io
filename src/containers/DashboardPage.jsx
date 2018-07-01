import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Divider } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Auth from '../modules/Auth'
import EventCard from '../components/dashboard/EventCard'
import TournamentCard from '../components/dashboard/TournamentCard'
import EventsModal from '../components/events/EventsModal'
import TournamentsModal from '../components/tournaments/TournamentsModal'
import { API_ROOT } from '../config'

export default class DashboardPage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			tournaments: [],
			events: [],
			eventsModalOpen: false,
			tournamentsModalOpen: false,
			editingEvent: false,
			editingTournament: false,
			currentEvent: {},
			currentTournament: {},
			setMessage: props.setMessage,
		}
	}

	componentDidMount() {
		const token = Auth.getToken()
		const requests = [`${API_ROOT}/tournaments`, `${API_ROOT}/events`].map(url =>
			fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then(res => res.json()),
		)

		Promise.all(requests).then(([tournaments, events]) => {
			this.setState({
				tournaments: tournaments,
				events: events,
			})
		})
	}

	setCurrentEvent = (e, id) => {
		const nextCurrentEvent = this.state.events.find(event => event._id === id)
		this.setState({
			currentEvent: nextCurrentEvent,
			eventsModalOpen: true,
			editingEvent: true,
		})
	}

	setCurrentTournament = (e, id) => {
		const tournament = this.state.tournaments.find(t => t._id === id)
		this.setState({
			currentTournament: tournament,
			tournamentsModalOpen: true,
			editingTournament: true,
		})
	}

	clearCurrentEvent = () => {
		this.setState({
			currentEvent: {},
			eventsModalOpen: true,
			editingEvent: false,
		})
	}

	clearCurrentTournament = () => {
		this.setState({
			currentTournament: {},
			editingTournament: false,
			tournamentsModalOpen: true,
		})
	}

	updateEvent = updatedEvent => {
		const { events } = this.state
		const index = events.map(event => event._id).indexOf(updatedEvent._id)
		if (index > -1) events[index] = updatedEvent
		else events.push(updatedEvent)
		this.setState({
			events,
		})
	}

	updateTournament = updated => {
		const { tournaments } = this.state
		const index = tournaments.map(t => t._id).indexOf(updated._id)
		if (index > -1) tournaments[index] = updated
		else tournaments.push(updated)
		this.setState({
			tournaments,
		})
	}

	closeModalParent = () => {
		this.setState({
			eventsModalOpen: false,
			tournamentsModalOpen: false,
			editingEvent: false,
			editingTournament: false,
		})
	}

	render() {
		const {
			tournaments,
			events,
			currentEvent,
			eventsModalOpen,
			tournamentsModalOpen,
			editingEvent,
			editingTournament,
			currentTournament,
			setMessage,
		} = this.state
		console.log(events)
		if (!tournaments || events.length === 0) {
			console.log('no data')
			return null
		}

		return (
			<div>
				<Header>{events[2].division}</Header>
				<Header as="h1">Tournaments</Header>
				<TournamentsModal
					currentTournament={{ ...currentTournament }}
					editingTournament={editingTournament}
					modalOpen={tournamentsModalOpen}
					clearCurrentTournament={this.clearCurrentTournament}
					updateTournament={this.updateTournament}
					setMessage={setMessage}
					closeModalParent={this.closeModalParent}
					events={events}
				/>
				<Grid>
					{tournaments.map(tournament => (
						<TournamentCard
							key={tournament._id}
							{...tournament}
							setCurrentTournament={this.setCurrentTournament}
						/>
					))}
				</Grid>
				<Divider />

				<Header as="h1">2017-18 Season Events</Header>
				<EventsModal
					currentEvent={{ ...currentEvent }}
					editingEvent={editingEvent}
					modalOpen={eventsModalOpen}
					clearCurrentEvent={this.clearCurrentEvent}
					updateEvent={this.updateEvent}
					setMessage={setMessage}
					closeModalParent={this.closeModalParent}
				/>
				<Grid>
					{events.map(event => (
						<EventCard
							key={event._id}
							{...event}
							setCurrentEvent={this.setCurrentEvent}
						/>
					))}
				</Grid>
			</div>
		)
	}
}

DashboardPage.propTypes = {
	setMessage: PropTypes.func.isRequired,
}
