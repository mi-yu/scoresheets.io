import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Auth from '../modules/Auth'
import EventCard from '../components/dashboard/EventCard'
import TournamentCard from '../components/dashboard/TournamentCard'
import EventsModal from '../components/events/EventsModal'
import TournamentsModal from '../components/tournaments/TournamentsModal'
import { API_ROOT } from '../config'
import { setTournaments } from '../actions/tournamentActions'
import { setEvents } from '../actions/eventActions'
import { setMessage, showMessage } from '../actions/messageActions'
import request from '../modules/request'
import arrayToObject from '../modules/arrayToObject'

class DashboardPage extends React.Component {
	state = {
		redirectToLogin: false,
	}

	componentDidMount() {
		// eslint-disable-next-line
		const {
			setEvents,
			setTournaments,
			setMessage,
			showMessage,
			tournaments,
			events,
			user,
		} = this.props

		if (!Object.keys(user).length) return null

		if (!tournaments.length || !events.length) {
			const token = Auth.getToken()
			const requests = [
				`${API_ROOT}/tournaments?${user.group !== 'admin' ? `userId=${user._id}` : null}`,
				`${API_ROOT}/events`,
			].map(url =>
				request(url, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			)

			Promise.all(requests)
				.then(([tournamentList, eventList]) => {
					setTournaments(arrayToObject(tournamentList))
					setEvents(arrayToObject(eventList))
				})
				.catch(err => {
					setMessage(err.message, 'error')
					showMessage()
					this.setState({
						redirectToLogin: true,
					})
				})
		}
	}

	render() {
		const { tournaments, events, user } = this.props
		const { redirectToLogin } = this.state
		if (!tournaments || !events) return null
		if (redirectToLogin || !Auth.isAuthenticated()) return <Redirect to="/users/login" />

		return (
			<div>
				<Header as="h1">Tournaments</Header>
				<TournamentsModal />
				<Grid>
					{Object.keys(tournaments).map(id => (
						<TournamentCard key={id} tournament={{ ...tournaments[id] }} />
					))}
				</Grid>
				<Divider />

				<Header as="h1">2017-18 Season Events</Header>
				{user.group === 'admin' && <EventsModal />}
				<Grid>
					{Object.keys(events).map(id => (
						<EventCard key={id} event={{ ...events[id] }} />
					))}
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
	user: state.users.currentUser,
})

const mapDispatchToProps = dispatch => ({
	setTournaments: tournaments => dispatch(setTournaments(tournaments)),
	setEvents: events => dispatch(setEvents(events)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	showMessage: () => dispatch(showMessage()),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(DashboardPage)
