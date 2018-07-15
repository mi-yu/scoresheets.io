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
			teamModalOpen: false,
			editingTeam: false,
			currentTeam: {},
			loading: true,
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
		].map(url =>
			request(url, {
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

	setCurrentTeam = teamId => {
		const { tournament } = this.props
		const team = tournament.teams.find(t => t._id === teamId)
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
		const { tournament, setCurrentTournament } = this.props
		const { teams } = tournament
		const combined = teams.map(team => (team._id === updatedTeam._id ? updatedTeam : team))

		setCurrentTournament({
			...tournament,
			teams: combined,
		})
	}

	addTeams = newTeams => {
		const { tournament, setCurrentTournament } = this.props
		const { teams } = tournament
		const combined = [...teams, ...newTeams].sort((t1, t2) => t1.teamNumber > t2.teamNumber)

		setCurrentTournament({
			...tournament,
			teams: combined,
		})
	}

	removeTeam = removed => {
		const { tournament, setCurrentTournament } = this.props
		const { teams } = tournament
		const filtered = teams.filter(team => team._id !== removed._id)

		setCurrentTournament({
			...tournament,
			teams: filtered,
		})
	}

	openTeamsModal = () => {
		this.setState({
			teamModalOpen: true,
		})
	}

	closeTeamsModal = () => {
		this.setState({
			teamModalOpen: false,
		})
	}

	handleChange = (e, { name, value }) =>
		this.setState({
			[name]: value,
		})

	handleFilter = (e, { name, value }) => {
		this.setState({ [name]: value.toLowerCase() })
	}

	matchesTeamsFilter = team => {
		const { teamsFilter } = this.state
		return (
			teamsFilter === '' ||
			team.school.toLowerCase().includes(teamsFilter) ||
			(team.division.toLowerCase() + team.teamNumber).includes(teamsFilter)
		)
	}

	matchesEventsFilter = event => {
		const { eventsFilter } = this.state
		return (
			event.name.toLowerCase().includes(eventsFilter) ||
			event.category.toLowerCase().includes(eventsFilter)
		)
	}

	render() {
		const { tournament, events } = this.props
		const {
			redirectToLogin,
			numAwards,
			teamModalOpen,
			editingTeam,
			currentTeam,
			loading,
		} = this.state

		if (redirectToLogin) return <Redirect to="/users/login" />
		if (loading) return null

		const { teams } = tournament

		return (
			<div>
				<Header as="h1">{tournament.name}</Header>
				<p>{new Date(tournament.date).toLocaleDateString()}</p>
				<p>{`${tournament.city}, ${tournament.state}`}</p>
				<Button
					primary
					as={Link}
					to={{
						pathname: `/tournaments/${tournament._id}/B/results`,
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
						to={`/tournaments/${tournament._id}/slideshow?numAwards=${numAwards || 4}`}
					>
						{'Start Awards Presentation'}
						<Icon name="right arrow" />
					</Button>
				</Button.Group>
				<Divider />
				<Grid>
					<Grid.Column floated="left" width={4}>
						<Header as="h2">{'Teams'}</Header>
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
				<TeamsModal
					tournament={tournament}
					modalOpen={teamModalOpen}
					openModal={this.openTeamsModal}
					closeModal={this.closeTeamsModal}
					editing={editingTeam}
					currentTeam={currentTeam}
					clearCurrentTeam={this.clearCurrentTeam}
					updateTeam={this.updateTeam}
					addTeams={this.addTeams}
				/>
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
						<Header as="h3">{'B Teams'}</Header>
						<Grid>
							{teams.map(team => {
								if (team.division === 'B' && this.matchesTeamsFilter(team)) {
									return (
										<TeamCard
											key={team._id}
											team={team}
											setCurrentTeam={this.setCurrentTeam}
											tournamentId={tournament._id}
											removeTeam={this.removeTeam}
										/>
									)
								}
								return null
							})}
						</Grid>
						<Header as="h3">{'C Teams'}</Header>
						<Grid>
							{teams.map(team => {
								if (team.division === 'C' && this.matchesTeamsFilter(team)) {
									return (
										<TeamCard
											key={team._id}
											team={team}
											setCurrentTeam={this.setCurrentTeam}
											tournamentId={tournament._id}
											removeTeam={this.removeTeam}
										/>
									)
								}
								return null
							})}
						</Grid>
					</div>
				)}
				<Divider />
				<Grid>
					<Grid.Column floated="left" width={4}>
						<Header as="h2">{'Events'}</Header>
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
	}),
	events: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			category: PropTypes.string.isRequired,
		}),
	).isRequired,
}

TournamentManagementPage.defaultProps = {
	match: {},
	tournament: {},
}

const mapStateToProps = state => ({
	events: state.events.eventList,
	tournament: state.tournaments.currentTournament,
})

const mapDispatchToProps = dispatch => ({
	setCurrentTournament: tournament => dispatch(setCurrentTournament(tournament)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	showMessage: () => dispatch(showMessage()),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TournamentManagementPage)
