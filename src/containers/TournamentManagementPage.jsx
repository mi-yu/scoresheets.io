import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Link } from 'react-router-dom'
import { Grid, Header, Divider, Button, Icon, Dropdown, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import request from '../modules/request'
import TournamentEventCard from '../components/tournaments/TournamentEventCard'
import TeamCard from '../components/tournaments/TeamCard'
import TeamsModal from '../components/tournaments/TeamsModal'
import { API_ROOT } from '../config'
import { setCurrentTournament } from '../actions/tournamentActions'
import { setEvents } from '../actions/eventActions'
import arrayToObject from '../modules/arrayToObject'
import { setMessage, showMessage } from '../actions/messageActions'

const awardsOptions = [
	{
		text: '3',
		value: 3,
	},
	{
		text: '4',
		value: 4,
	},
	{
		text: '5',
		value: 5,
	},
	{
		text: '6',
		value: 6,
	},
]

class TournamentManagementPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			eventsFilter: '',
			teamsFilter: '',
			teams: [],
		}
	}

	componentDidMount() {
		// eslint-disable-next-line
		const { id } = this.props.match.params
		const { tournament, setCurrentTournament, setMessage, events, setEvents } = this.props
		console.log('events before fetches', events)
		const token = Auth.getToken()

		if (!Object.keys(tournament).length || !tournament.events || !Object.keys(events).length) {
			const requests = [`${API_ROOT}/tournaments/${id}`, `${API_ROOT}/tournaments/${id}/teams`, `${API_ROOT}/events`].map(url =>
				request(url, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
			)

			Promise.all(requests)
				.then(([returnedTournament, teams, eventList]) => {
					console.log('array to object', arrayToObject(eventList))
					console.log('calling setCurrentTournament')
					setCurrentTournament({
						...returnedTournament,
						teams,
					})
					console.log('called setCurrentTournament')
					setEvents(arrayToObject(eventList))
					console.log('called setEvents')
				})
				.catch(err => {
					console.log(err)
					setMessage(err.message, 'error')
					showMessage()
				})
		}
	}

	setCurrentTeam = (e, id) => {
		const team = this.state.teams.find(t => t._id === id)
		this.setState({
			editingTeam: true,
			currentTeam: team,
			teamModalOpen: true,
		})
	}

	clearCurrentTeam = () => {
		this.setState({
			currentTeam: {},
			editingTeam: false,
			teamModalOpen: true,
		})
	}

	updateTeam = updatedTeam => {
		const { teams } = this.state
		const index = teams.map(team => team._id).indexOf(updatedTeam._id)
		if (index > -1) teams[index] = updatedTeam
		else {
			teams.push(updatedTeam)
			teams.sort((teamA, teamB) => teamA.teamNumber > teamB.teamNumber)
		}
		this.setState({ teams })
	}

	closeModalParent = () => {
		this.setState({ editingTeam: false, teamModalOpen: false })
	}

	handleChange = (e, { name, value }) => this.setState({
		[name]: value,
	})

	handleFilter = (e, { name, value }) => {
		this.setState({ [name]: value.toLowerCase() })
	}

	matchesTeamsFilter = team => {
		const { teamsFilter } = this.state
		return (
			teamsFilter === ''
			|| team.school.toLowerCase().includes(teamsFilter)
			|| (team.division.toLowerCase() + team.teamNumber).includes(teamsFilter)
		)
	}

	matchesEventsFilter = event => {
		const { eventsFilter } = this.state
		return (
			event.name.toLowerCase().includes(eventsFilter)
			|| event.category.toLowerCase().includes(eventsFilter)
		)
	}

	render() {
		const { tournament, events } = this.props
		const { redirectToLogin, numAwards } = this.state
		const { teams } = tournament

		if (redirectToLogin) return <Redirect to="/users/login" />
		if (!tournament.events || !teams || !Object.keys(events).length) return null

		console.log(events)

		return (
			<div>
				<Header as="h1">
					{tournament.name}
				</Header>
				<p>
					{new Date(tournament.date).toLocaleDateString()}
				</p>
				<p>
					{`${tournament.city}, ${tournament.state}`}
				</p>
				<Button
					primary
					as={Link}
					to={{
						pathname: `/tournaments/${tournament._id}/B/results`,
						state: { tournament: { ...tournament } },
					}}
				>
					<Icon name="trophy" />
					{'B Results'}
				</Button>
				<Button
					primary
					as={Link}
					to={{
						pathname: `/tournaments/${tournament._id}/C/results`,
						state: { tournament: { ...tournament } },
					}}
				>
					<Icon name="trophy" />
					{'C Results'}
				</Button>
				<Button.Group>
					<Dropdown
						button
						text={numAwards || 'Choose number of awards'}
						name="numAwards"
						options={awardsOptions}
						onChange={this.handleChange}
						value={numAwards}
					/>
					<Button
						icon
						primary
						labelPosition="right"
						as={Link}
						to={{
							pathname: `/tournaments/${tournament._id}/slideshow`,
							state: { tournament },
						}}
					>
						{'Start Awards Presentation'}
						<Icon name="right arrow" />
					</Button>
				</Button.Group>
				<Divider />
				<Grid>
					<Grid.Column floated="left" width={4}>
						<Header as="h2">
							{'Teams'}
						</Header>
					</Grid.Column>
					<Grid.Column floated="right" width={4} textAlign="right">
						<Input
							name="teamsFilter"
							placeholder="Filter teams..."
							icon="search"
							onChange={this.handleFilter}
						/>
					</Grid.Column>
				</Grid>
				{/* <TeamsModal
					currentTeam={currentTeam}
					tournament={tournament}
					schools={schools}
					editingTeam={editingTeam}
					modalOpen={teamModalOpen}
					closeModalParent={this.closeModalParent}
					updateTeam={this.updateTeam}
					clearCurrentTeam={this.clearCurrentTeam}
					setMessage={this.state.setMessage}
				/> */}
				<Button
					as={Link}
					to={{
						pathname: `/tournaments/${tournament._id}/edit/bulkAddTeams`,
						state: { tournament: { ...tournament } },
					}}
					color="green"
				>
					<Icon name="plus" />
					<Icon name="zip" />
					{'Bulk Add Teams'}
				</Button>
				{teams.length > 0 && (
					<div>
						<Header as="h3">
							{'B Teams'}
						</Header>
						<Grid>
							{teams.map(team => {
								if (team.division === 'B' && this.matchesTeamsFilter(team)) {
									return <TeamCard key={team._id} team={team} />
								}
								return null
							})}
						</Grid>
						<Header as="h3">
							{'C Teams'}
						</Header>
						<Grid>
							{teams.map(team => {
								if (team.division === 'C' && this.matchesTeamsFilter(team)) {
									return <TeamCard key={team._id} team={team} />
								}
								return null
							})}
						</Grid>
					</div>
				)}
				<Divider />
				<Grid>
					<Grid.Column floated="left" width={4}>
						<Header as="h2">
							{'Events'}
						</Header>
					</Grid.Column>
					<Grid.Column floated="right" width={4} textAlign="right">
						<Input
							name="eventsFilter"
							placeholder="Filter events..."
							icon="search"
							onChange={this.handleFilter}
						/>
					</Grid.Column>
				</Grid>
				<Grid>
					{tournament.events.map(eventId => {
						if (this.matchesEventsFilter(events[eventId])) {
							return (
								<TournamentEventCard
									key={events[eventId]._id}
									{...events[eventId]}
									tournamentId={tournament._id}
								/>
							)
						}
						return null
					})}
				</Grid>
			</div>
		)
	}
}

TournamentManagementPage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.object.isRequired,
	}),
	setMessage: PropTypes.func.isRequired,
	setCurrentTournament: PropTypes.func.isRequired,
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
	}).isRequired,
	events: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		category: PropTypes.string.isRequired,
	})).isRequired,
}

TournamentManagementPage.defaultProps = {
	match: undefined,
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
	events: state.events.eventList,
})

const mapDispatchToProps = dispatch => ({
	setCurrentTournament: tournament => dispatch(setCurrentTournament(tournament)),
	setEvents: events => dispatch(setEvents(events)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	showMessage: () => dispatch(showMessage()),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TournamentManagementPage)
