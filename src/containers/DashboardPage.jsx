import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Divider } from 'semantic-ui-react'
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
import request from '../modules/request'

class DashboardPage extends React.Component {
	componentDidMount() {
		// eslint-disable-next-line
		const { setEvents, setTournaments, setMessage, tournaments, events } = this.props
		if (!tournaments.length || !events.length) {
			const token = Auth.getToken()
			const requests = [`${API_ROOT}/tournaments`, `${API_ROOT}/events`].map(url =>
				request(url, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			)

			Promise.all(requests)
				.then(([tournamentList, eventList]) => {
					setTournaments(tournamentList)
					setEvents(eventList)
				})
				.catch(err => setMessage(err, 'error'))
		}
	}

	render() {
		const { tournaments, events } = this.props
		if (!tournaments || !events) return null

		return (
			<div>
				<Header as="h1">
					{'Tournaments'}
				</Header>
				<TournamentsModal />
				<Grid>
					{tournaments.map(tournament => (
						<TournamentCard key={tournament._id} tournament={{ ...tournament }} />
					))}
				</Grid>
				<Divider />

				<Header as="h1">
					{'2017-18 Season Events'}
				</Header>
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
	tournaments: PropTypes.arrayOf(PropTypes.object).isRequired,
	events: PropTypes.arrayOf(PropTypes.object).isRequired,
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
