import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import { API_ROOT } from '../config'
import request from '../modules/request'

class ResultsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...props,
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
		const requests = urls.map(url =>
			request(url, {
				method: 'GET',
				headers: new Headers({
					Authorization: `Bearer ${token}`,
				}),
			}),
		)

		Promise.all(requests)
			.then(([entries, teams, tournament]) => {
				const sortedEntries = entries.sort((a, b) => a.event.name.localeCompare(b.event.name))
				this.setState({
					entries: sortedEntries,
					teams,
					tournament,
				})
			})
			.catch(err => {
				console.log(err)
			})
	}

	breakTie = (t1, t2) => {
		const MAX_PLACES = 10
		let currentPlace = 1
		let tieBroken = false

		let t1Count = 0
		let t2Count = 0

		while (!tieBroken && currentPlace <= MAX_PLACES) {
			t1Count = this.countOccurrences(t1.scores, currentPlace)
			t2Count = this.countOccurrences(t2.scores, currentPlace)
			if (t1Count - t2Count !== 0) tieBroken = true
			else currentPlace += 1
		}

		return t2Count - t1Count
	}

	countOccurrences = (scores, target) =>
		scores.reduce((total, score) => total + Number(score === target), 0)

	populateScores = (entries, teams) => {
		let totalScore = 0
		teams.forEach(team => {
			team.scores = []
			entries.forEach(entry => {
				entry.scores.forEach(score => {
					if (score.team._id === team._id) {
						team.scores.push(score.rank || 0)
						totalScore += score.rank || 0
					}
				})
			})
			team.totalScore = totalScore
			totalScore = 0
		})

		teams.sort((t1, t2) => {
			const scoreDiff = t1.totalScore - t2.totalScore
			if (scoreDiff === 0) return this.breakTie(t1, t2)
			return scoreDiff
		})

		teams.forEach((team, index) => {
			team.rank = index + 1
		})

		return teams
	}

	render() {
		const { match } = this.props
		const { division } = match.params
		const { entries, teams, tournament } = this.state
		if (!entries) return null

		const populatedTeams = this.populateScores(entries, teams)

		return (
			<div>
				<Breadcrumb>
					<Breadcrumb.Section>
						<Link to={`/tournaments/${tournament._id}/manage`}>
							{tournament.name}
						</Link>
					</Breadcrumb.Section>
					<Breadcrumb.Divider />
					<Breadcrumb.Section>
						Division {division} Results
					</Breadcrumb.Section>
				</Breadcrumb>
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
									{team.teamNumber}{' '}
									{`(${team.displayName})`}
								</Table.Cell>
								{team.scores.map(score => <Table.Cell>{score}</Table.Cell>)}
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
	location: PropTypes.shape({
		state: PropTypes.object.isRequired,
	}),
}

ResultsPage.defaultProps = {
	match: undefined,
	location: undefined,
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
})

export default connect(
	mapStateToProps,
	null,
)(ResultsPage)
