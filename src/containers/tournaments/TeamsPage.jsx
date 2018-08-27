import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Button, Icon, Input, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import TeamTable from '../../components/tournaments/teams/TeamTable'
import TeamGrid from '../../components/tournaments/teams/TeamGrid'
import { setEditingTeam, showEditCreateModal, clearCurrentTeam } from '../../actions/teamActions'
import ConfirmDeleteTeamModal from '../../components/tournaments/teams/ConfirmDeleteTeamModal'
import EditCreateTeamModal from '../../components/tournaments/teams/EditCreateTeamModal'
import { API_ROOT } from '../../config'
import request from '../../modules/request'
import Auth from '../../modules/Auth'
import { setCurrentTournament } from '../../actions/tournamentActions'
import { setMessage } from '../../actions/messageActions';

class TeamsPage extends React.Component {
	state = {
		filter: '',
		displayFormat: 'rows',
	}

	componentDidMount() {
		const { tournament, match, setCurrentTournament, setMessage } = this.props
		if (!Object.keys(tournament).length || !tournament.teams) {
			const token = Auth.getToken()

			const urls = [
				`${API_ROOT}/tournaments/${match.params.tournamentId}`,
				`${API_ROOT}/tournaments/${match.params.tournamentId}/teams`,
			]

			const requests = urls.map(url => request(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}))

			Promise.all(requests)
				.then(([tournamentResponse, teamsResponse]) => {
					setCurrentTournament({
						...tournamentResponse,
						teams: teamsResponse,
					})
				})
				.catch(() => {
					setMessage('There was a problem on the server, try again later.', 'error')
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

	matchcesFilter = team => {
		const { filter } = this.state
		return (
			filter === ''
			|| team.school.toLowerCase().includes(filter)
			|| (team.division.toLowerCase() + team.teamNumber).includes(filter)
		)
	}

	render() {
		const { tournament, setEditingTeam, showEditCreateModal, clearCurrentTeam } = this.props
		const { displayFormat } = this.state

		if (!tournament || !tournament.teams) return null

		const { teams } = tournament

		return (
			<div>
				<ConfirmDeleteTeamModal />
				<EditCreateTeamModal />
				<Grid>
					<Grid.Column floated="left">
						<Header as="h2" floated="left">Teams</Header>
					</Grid.Column>
					<Grid.Column width={12} textAlign="right">
						<Button
							basic
							size="tiny"
							color="green"
							onClick={() => {
								setEditingTeam(false)
								clearCurrentTeam()
								showEditCreateModal()
							}}
							style={{ marginRight: '1em' }}
						>
							<Icon name="plus" />
							New Team
						</Button>
						<Button
							size="tiny"
							basic
							as={Link}
							to={`/tournaments/${tournament._id}/teams/add`}
							color="green"
							style={{ marginRight: '1em' }}
						>
							<Icon name="plus" />
							<Icon name="zip" />
							Bulk Add Teams
						</Button>
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
							placeholder="Filter teams..."
							icon="search"
							onChange={this.handleFilter}
						/>
					</Grid.Column>
				</Grid>
				<Grid>
					{
						teams.length > 0 ? (
							<div style={{ marginTop: '2em', width: '100%' }}>
								<Header as="h3">B Teams</Header>
								{displayFormat === 'grid' ? (
									<TeamGrid division="B" />
								) : (
										<TeamTable division="B" />
									)}
								<Header as="h3">C Teams</Header>
								{displayFormat === 'grid' ? (
									<TeamGrid division="C" />
								) : (
										<TeamTable division="C" />
									)}
							</div>
						) : (
								<Segment style={{ width: '100%' }} textAlign="center" basic>
									It looks like there are no teams here!
									If you expect to see teams here, try refreshing.
							</Segment>
							)
					}
				</Grid>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
	currentTeamId: state.teams.currentTeamId,
})

const mapDispatchToProps = dispatch => ({
	showEditCreateModal: () => dispatch(showEditCreateModal()),
	setEditingTeam: (team) => dispatch(setEditingTeam(team)),
	clearCurrentTeam: () => dispatch(clearCurrentTeam()),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	setCurrentTournament: (tournament) => dispatch(setCurrentTournament(tournament)),
})

TeamsPage.propTypes = {
	showEditCreateModal: PropTypes.func.isRequired,
	setEditingTeam: PropTypes.func.isRequired,
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		teams: PropTypes.array.isRequired,
	}).isRequired,
	clearCurrentTeam: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			tournamentId: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamsPage)
