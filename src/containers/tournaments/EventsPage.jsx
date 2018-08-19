import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Header, Input, Button, Icon } from 'semantic-ui-react'
import Auth from '../../modules/Auth';
import { API_ROOT } from '../../config';
import request from '../../modules/request';
import { setEvents } from '../../actions/eventActions'
import { setCurrentTournament } from '../../actions/tournamentActions'
import { setMessage } from '../../actions/messageActions'
import arrayToObject from '../../modules/arrayToObject'
import TournamentEventGrid from '../../components/tournaments/events/TournamentEventGrid'
import TournamentEventTable from '../../components/tournaments/events/TournamentEventTable'

class EventsPage extends React.Component {
	state = {
		filter: '',
		displayFormat: 'rows',
	}

	componentDidMount() {
		const { eventList, tournament, match, setEvents, setCurrentTournament, setMessage } = this.props
		const { tournamentId } = match.params
		const urls = []
		if (!Object.keys(eventList).length) urls.push(`${API_ROOT}/events`)
		if (!Object.keys(tournament).length) urls.push(`${API_ROOT}/tournaments/${tournamentId}`, `${API_ROOT}/tournaments/${tournamentId}/teams`)
		if (urls.length) {
			const token = Auth.getToken()
			const requests = urls.map(url => request(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}))

			Promise.all(requests)
				.then(([eventsResponse, tournamentResponse, teamsResponse]) => {
					setEvents(arrayToObject(eventsResponse))
					setCurrentTournament({
						...tournamentResponse,
						teams: teamsResponse,
					})
				})
				.catch(() => {
					setMessage('There was a problem contacting the server, try again later.', 'error')
				})
		}
	}

	handleFilter = (e, { name, value }) => {
		this.setState({
			[name]: value.toLowerCase(),
		})
	}

	handleTeamsViewToggle = (e, { name }) => {
		this.setState({
			displayFormat: name,
		})
	}

	matchesFilter = event => {
		const { filter } = this.state
		if (!event) return false
		return (
			event.name.toLowerCase().includes(filter)
			|| event.category.toLowerCase().includes(filter)
		)
	}

	render() {
		const { displayFormat } = this.state
		const { tournament, eventList } = this.props
		const { events } = tournament

		if (!eventList || !events) return null

		const filteredEvents = events.filter(eventId => this.matchesFilter(eventList[eventId]))

		return (
			<div>
				<Grid>
					<Grid.Column floated="left" width={4}>
						<Header as="h2">Events</Header>
					</Grid.Column>
					<Grid.Column floated="right" width={6} textAlign="right">
						<Button.Group style={{ marginRight: '1rem' }} size="tiny">
							<Button icon name="rows" active={displayFormat === 'rows'} onClick={this.handleTeamsViewToggle}>
								<Icon name="align justify" />
							</Button>
							<Button icon name="grid" active={displayFormat === 'grid'} onClick={this.handleTeamsViewToggle}>
								<Icon name="grid layout" />
							</Button>
						</Button.Group>
						<Input
							size="small"
							name="filter"
							placeholder="Filter events..."
							icon="search"
							onChange={this.handleFilter}
						/>
					</Grid.Column>
				</Grid>
				{
					displayFormat === 'grid'
						? <TournamentEventGrid events={filteredEvents} />
						: <TournamentEventTable events={filteredEvents} />
				}
			</div>
		)
	}
}

EventsPage.propTypes = {
	match: PropTypes.shape({
		tournamentId: PropTypes.string.isRequired,
	}).isRequired,
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		events: PropTypes.array.isRequired,
	}).isRequired,
	eventList: PropTypes.objectOf(PropTypes.object).isRequired,
	setEvents: PropTypes.func.isRequired,
	setCurrentTournament: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
	eventList: state.events.eventList,
})

const mapDispatchToProps = dispatch => ({
	setEvents: (events) => dispatch(setEvents(events)),
	setCurrentTournament: (tournament) => dispatch(setCurrentTournament(tournament)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage)
