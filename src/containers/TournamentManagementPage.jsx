import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Link } from 'react-router-dom'
import { Grid, Header, Divider, Button, Icon, Dropdown, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import request from '../modules/request'
import TournamentEventCard from '../components/tournaments/TournamentEventCard'
import { API_ROOT } from '../config'
import { setCurrentTournament } from '../actions/tournamentActions'
import { setMessage, showMessage } from '../actions/messageActions'
import ConfirmDeleteTeamModal from '../components/teams/ConfirmDeleteTeamModal'
import EditCreateTeamModal from '../components/teams/EditCreateTeamModal'
import { showEditCreateModal, setEditingTeam } from '../actions/teamActions'
import TeamGrid from '../components/teams/TeamGrid'
import TeamTable from '../components/teams/TeamTable'

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
			loading: true,
			teamDisplayFormat: 'rows',
		}
	}

	componentDidMount() {
		// eslint-disable-next-line
		const { id } = this.props.match.params
		const { setCurrentTournament, setMessage } = this.props
		const token = Auth.getToken()

		const requests = [
			`${API_ROOT}/tournaments/${id}`,
			`${API_ROOT}/tournaments/${id}/teams`,
		].map(url => request(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),
		)

		Promise.all(requests)
			.then(([returnedTournament, teams]) => {
				setCurrentTournament({
					...returnedTournament,
					teams,
				})
				this.setState({
					loading: false,
				})
			})
			.catch(err => {
				setMessage(err.message, 'error')
				showMessage()
			})
	}

	handleFilter = (e, { name, value }) => {
		this.setState({
			[name]: value.toLowerCase(),
		})
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
		if (!event) return false
		return (
			event.name.toLowerCase().includes(eventsFilter)
			|| event.category.toLowerCase().includes(eventsFilter)
		)
	}

	render() {
		const { tournament, events, currentTeamId, setEditingTeam, showEditCreateModal } = this.props
		const {
			redirectToLogin,
			numAwards,
			loading,
			teamDisplayFormat,
		} = this.state

		if (redirectToLogin) return <Redirect to="/users/login" />
		if (loading) return null

		const { teams } = tournament

		return (
			<div>
				<ConfirmDeleteTeamModal />
				<EditCreateTeamModal key={currentTeamId} />
				<Header as="h1">{tournament.name}</Header>
				<p>{new Date(tournament.date).toLocaleDateString()}</p>
				<p>{`${tournament.city}, ${tournament.state}`}</p>
				<Button
					basic
					size="tiny"
					primary
					as={Link}
					to={{
						pathname: `/tournaments/${tournament._id}/B/results`,
					}}
				>
					<Icon name="trophy" />
					B Results
				</Button>
				<Button
					basic
					size="tiny"
					primary
					as={Link}
					to={{
						pathname: `/tournaments/${tournament._id}/C/results`,
					}}
				>
					<Icon name="trophy" />
					C Results
				</Button>
				<Button.Group size="tiny">
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
						to={`/tournaments/${tournament._id}/slideshow?numAwards=${numAwards || 4}`}
						rel="noopener noreferrer"
						target="_blank"
					>
						{'Start Awards Presentation'}
						<Icon name="right arrow" />
					</Button>
				</Button.Group>
				<Divider />
				<Grid>
					<Grid.Column floated="left" width={4}>
						<Header as="h2">Events</Header>
					</Grid.Column>
					<Grid.Column floated="right" width={4} textAlign="right">
						<Input
							size="small"
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
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
	}),
	events: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			category: PropTypes.string.isRequired,
		}),
	).isRequired,
	setMessage: PropTypes.func.isRequired,
	setCurrentTournament: PropTypes.func.isRequired,
	setEditingTeam: PropTypes.func.isRequired,
	showEditCreateModal: PropTypes.func.isRequired,
	currentTeamId: PropTypes.string.isRequired,
}

TournamentManagementPage.defaultProps = {
	match: {},
	tournament: {},
}

const mapStateToProps = state => ({
	events: state.events.eventList,
	tournament: state.tournaments.currentTournament,
	currentTeamId: state.teams.currentTeamId,
})

const mapDispatchToProps = dispatch => ({
	setCurrentTournament: tournament => dispatch(setCurrentTournament(tournament)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	showMessage: () => dispatch(showMessage()),
	showEditCreateModal: () => dispatch(showEditCreateModal()),
	setEditingTeam: (editing) => dispatch(setEditingTeam(editing)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TournamentManagementPage)
