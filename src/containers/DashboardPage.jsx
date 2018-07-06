import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Divider } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import EventCard from '../components/dashboard/EventCard'
import TournamentCard from '../components/dashboard/TournamentCard'
import EventsModal from '../components/events/EventsModal'
import TournamentsModal from '../components/tournaments/TournamentsModal'
import { API_ROOT } from '../config'
import { setTournaments } from '../actions/tournamentActions'
import { setEvents } from '../actions/eventActions'
import { setMessage } from '../actions/messageActions'

class DashboardPage extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		const { setEvents, setTournaments, setMessage } = this.props
		const token = Auth.getToken()
		const requests = [`${API_ROOT}/tournaments`, `${API_ROOT}/events`].map(url =>
			fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then(res => res.json()),
		)

		Promise.all(requests)
			.then(([tournaments, events]) => {
				setTournaments(tournaments)
				setEvents(events)
			})
			.catch(err => setMessage(err, 'error'))
	}

	render() {
		const { tournaments, events } = this.props
		if (!tournaments || !events) {
			console.log('no data')
			return null
		}

		return (
			<div>
				<Header as="h1">Tournaments</Header>
				<TournamentsModal />
				<Grid>
					{tournaments.map(tournament => (
						<TournamentCard key={tournament._id} tournament={{ ...tournament }} />
					))}
				</Grid>
				<Divider />

				<Header as="h1">2017-18 Season Events</Header>
				<EventsModal />
				<Grid>
					{events.map(event => <EventCard key={event._id} event={{ ...event }} />)}
				</Grid>
			</div>
		)
	}
}

DashboardPage.propTypes = {
	setMessage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	tournaments: state.tournaments.tournamentList,
	events: state.events.eventList,
	currentTournament: state.tournaments.currentTournament,
	currentEvent: state.events.currentEvent,
	tournamentsModalOpen: state.tournaments.modalOpen,
	eventsModalOpen: state.events.modalOpen,
})

const mapDispatchToProps = dispatch => ({
	setTournaments: tournaments => dispatch(setTournaments(tournaments)),
	setEvents: events => dispatch(setEvents(events)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DashboardPage)
