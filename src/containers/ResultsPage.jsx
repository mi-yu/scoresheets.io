import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Button, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import { API_ROOT, RESULTS_MANAGER_API_URL } from '../config'
import request from '../modules/request'
import ResultsUnauthorized from './errors/ResultsUnauthorized'
import { setMessage } from '../actions/messageActions'
import populateScores from '../lib/scores/populateScores'

class ResultsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...props,
			unauthorized: false,
			resultsLoading: false,
			resultsGenerated: false,
		}
	}

	componentDidMount() {
		const { division, tournamentId } = this.props.match.params
		const token = Auth.getToken()

		const urls = [
			`${API_ROOT}/tournaments/${tournamentId}/scoresheets?division=${division}`,
			`${API_ROOT}/tournaments/${tournamentId}/teams?division=${division}`,
			`${API_ROOT}/tournaments/${tournamentId}`,
		]
		const requests = urls.map(url => request(url, {
			method: 'GET',
			headers: new Headers({
				Authorization: `Bearer ${token}`,
			}),
		}),
		)

		Promise.all(requests)
			.then(([entries, teams, tournament]) => {
				const sortedEntries = entries.sort((a, b) => a.event.name.localeCompare(b.event.name),
				)
				this.setState({
					entries: sortedEntries,
					teams,
					tournament,
				})
			})
			.catch(err => {
				if (err.code === 401) {
					this.setState({
						unauthorized: true,
					})
				}
			})
	}

	postCSV = populatedTeams => () => {
		const { entries, tournament } = this.state
		const { setMessage, match } = this.props
		const { division } = match.params

		this.setState({ resultsLoading: true })

		const eventNames = entries.map(entry => entry.event.name)
		const csvHeader = ['Team Number', 'School', ...eventNames, 'Total Score', 'Rank']
		const csvBody = populatedTeams.map(team => [
			`${team.division}${team.teamNumber}`,
			team.displayName,
			...team.scores,
			team.totalScore,
			team.rank,
		])

		const combinedCSV = [csvHeader, ...csvBody]

		const token = Auth.getToken()
		request(`${RESULTS_MANAGER_API_URL}/generate`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				scoreData: combinedCSV,
				tournament,
				division,
			}),
		})
			.then(res => {
				this.setState({
					resultsLoading: false,
					resultsGenerated: true,
					resultsLink: res.link,
				})
			})
			.catch(err => {
				setMessage(JSON.stringify(err), 'error')
				this.setState({ resultsLoading: false })
			})
	}

	render() {
		const { match } = this.props
		const { division } = match.params
		const {
			entries,
			teams,
			tournament,
			unauthorized,
			resultsLoading,
			resultsGenerated,
			resultsLink,
		} = this.state
		if (unauthorized) return <ResultsUnauthorized />
		if (!entries) return null

		const populatedTeams = populateScores(entries, teams)

		return (
			<div id="results-table">
				<Breadcrumb>
					<Breadcrumb.Section>
						<Link to={`/tournaments/${tournament._id}`}>{tournament.name}</Link>
					</Breadcrumb.Section>
					<Breadcrumb.Divider />
					<Breadcrumb.Section>Division {division} Results</Breadcrumb.Section>
				</Breadcrumb>
				<br />
				{resultsGenerated ? (
					<Button
						style={{ marginTop: '1em' }}
						color="green"
						as="a"
						href={resultsLink}
						rel="noopener noreferrer"
						target="_blank"
					>
						Click to download
					</Button>
				) : (
					<Button
						basic
						loading={resultsLoading}
						style={{ marginTop: '1em' }}
						onClick={this.postCSV(populatedTeams)}
					>
							Generate CSV
					</Button>
				)}
				<Table celled collapsing size="small" compact>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell verticalAlign="bottom">
								Team (School)
							</Table.HeaderCell>
							{entries.map(entry => (
								<Table.HeaderCell key={entry._id}>
									<div className="column-header">{entry.event.name}</div>
								</Table.HeaderCell>
							))}
							<Table.HeaderCell verticalAlign="bottom">Total</Table.HeaderCell>
							<Table.HeaderCell verticalAlign="bottom">Rank</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{populatedTeams.map(team => (
							<Table.Row key={team._id}>
								<Table.Cell>
									{team.division}
									{team.teamNumber} {`(${team.displayName})`}
								</Table.Cell>
								{team.scores.map(score => (
									<Table.Cell>{score}</Table.Cell>
								))}
								<Table.Cell>{team.totalScore}</Table.Cell>
								<Table.Cell>{team.rank}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
		)
	}
}

ResultsPage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.object.isRequired,
	}),
}

ResultsPage.defaultProps = {
	match: undefined,
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
})

const mapDispatchToProps = dispatch => ({
	setMessage: (message, type) => dispatch(setMessage(message, type)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ResultsPage)
