import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Button, Icon, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import TeamTable from '../../components/teams/TeamTable'
import TeamGrid from '../../components/teams/TeamGrid'
import { setEditingTeam, showEditCreateModal } from '../../actions/teamActions'

class TeamsPage extends React.Component {
	state = {
		filter: '',
		displayFormat: 'rows',
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
		const { tournament, setEditingTeam, showEditCreateModal } = this.props
		const { displayFormat } = this.state
		const { teams } = tournament
		const divBTeams = teams.filter(team => (team.division === 'B' && this.matchcesFilter(team)))
		const divCTeams = teams.filter(team => (team.division === 'C' && this.matchcesFilter(team)))

		return (
			<div>
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
						teams.length > 0 && (
							<div style={{ marginTop: '2em', width: '100%' }}>
								<Header as="h3">B Teams</Header>
								{displayFormat === 'grid' ? (
									<TeamGrid teams={divBTeams} />
								) : (
									<TeamTable teams={divBTeams} />
								)}
								<Header as="h3">C Teams</Header>
								{displayFormat === 'grid' ? (
									<TeamGrid teams={divCTeams} />
								) : (
									<TeamTable teams={divCTeams} />
								)}
							</div>
						)
					}
				</Grid>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
})

const mapDispatchToProps = dispatch => ({
	showEditCreateModal: () => dispatch(showEditCreateModal()),
	setEditingTeam: (team) => dispatch(setEditingTeam(team)),
})

TeamsPage.propTypes = {
	showEditCreateModal: PropTypes.func.isRequired,
	setEditingTeam: PropTypes.func.isRequired,
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		teams: PropTypes.array.isRequired,
	}).isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamsPage)
