import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Checkbox, Segment, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import csvParse from 'csv-parse/lib/es5/sync'
import Auth from '../modules/Auth'
import request from '../modules/request'
import { setMessage } from '../actions/messageActions'
import { API_ROOT } from '../config'
import ScoreEntryForm from '../components/tournaments/ScoreEntryForm'

class ScoreEntryPage extends React.Component {
	constructor(props) {
		super(props)
		this.fileReader = new FileReader()
		this.state = {
			scoresheetEntry: {
				scores: [],
			},
		}
	}

	componentDidMount() {
		const { setMessage } = this.props
		const { tournamentId, eventId, division } = this.props.match.params
		const token = Auth.getToken()
		const urls = [`${API_ROOT}/tournaments/${tournamentId}/scoresheets/${division}/${eventId}`]

		const requests = urls.map(url => request(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),
		)

		Promise.all(requests)
			.then(([scoresheet]) => {
				this.setState({
					scoresheetEntry: scoresheet,
					loading: false,
				})
			})
			.catch(err => {
				setMessage(err.message, 'error')
			})
	}

	handleReadFile = () => {
		// TODO: finish this
		const { scoresheetEntry } = this.state
		const scores = scoresheetEntry.scores.slice()

		const parsed = csvParse(this.fileReader.result)

		parsed.forEach(pair => {
			const teamNumber = Number(pair[0])
			const rawScore = Number(pair[1])
			const idx = scores.map(score => score.team.teamNumber).indexOf(teamNumber)
			scores[idx].rawScore = rawScore
		})

		this.setState({
			scoresheetEntry: {
				...scoresheetEntry,
				scores,
			},
		})
	}

	handleCSVUpload = e => {
		this.fileReader = new FileReader()
		this.fileReader.onloadend = this.handleReadFile
		this.fileReader.readAsText(e.target.files[0])
	}

	toggleScoresheetLock = () => {
		const { scoresheetEntry } = this.state
		const { locked: originalLocked, event, tournament, division } = scoresheetEntry
		this.setState({
			scoresheetEntry: {
				...scoresheetEntry,
				locked: !originalLocked,
			},
		})

		const token = Auth.getToken()
		const url = `${API_ROOT}/tournaments/${tournament._id}/scoresheets/${division}/${event._id}`
		request(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				locked: !originalLocked,
			}),
		})
			.then(() => {
				setMessage(`Successfully locked scores for ${event.name} ${division}`, 'success')
			})
			.catch(err => {
				this.setState({
					scoresheetEntry: {
						...scoresheetEntry,
						locked: originalLocked,
					},
				})
				setMessage(err.message, 'error')
			})
	}

	render() {
		const { tournament, match } = this.props
		const { scoresheetEntry, loading } = this.state
		const { scores, locked } = scoresheetEntry
		const { division } = match.params

		if (loading) return null
		if (!scores.length) {
			return (
				<Segment>
					It looks like there are no division {division} teams in this tournament.
					Create one <Link to={`/tournaments/${tournament._id}/teams`}>here</Link>.
				</Segment>
			)
		}

		return (
			<div>
				<Breadcrumb>
					<Breadcrumb.Section>
						<Link to={`/tournaments/${scoresheetEntry.tournament._id}/events`}>
							{scoresheetEntry.tournament.name} Events
						</Link>
					</Breadcrumb.Section>
					<Breadcrumb.Divider />
					<Breadcrumb.Section>
						{scoresheetEntry.event.name} {scoresheetEntry.division}
					</Breadcrumb.Section>
				</Breadcrumb>
				<div
					style={{
						margin: '4em 0 0 0',
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
					}}
				>
					<label
						htmlFor="upload"
					>
						<Button
							icon="upload"
							label={{
								basic: true,
								content: 'Import CSV',
							}}
							labelPosition="right"
						/>
						<input
							hidden
							id="upload"
							type="file"
							onChange={this.handleCSVUpload}
						/>
					</label>
					<label style={{ fontSize: '1.2em', marginRight: '1em' }} htmlFor="lock scores">Lock Scores</label>
					<Checkbox toggle name="locked" checked={locked} onChange={this.toggleScoresheetLock} />
				</div>
				{
					scores.length === 0 ? (
						<Segment size="large" textAlign="center">
							There are no division {scoresheetEntry.division} teams in this tournament.
						</Segment>
					) : (
						<ScoreEntryForm scoresheetEntry={scoresheetEntry} locked={locked} />
					)
				}
			</div>
		)
	}
}

ScoreEntryPage.propTypes = {
	setMessage: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.object.isRequired,
	}),
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
	}).isRequired,
}

ScoreEntryPage.defaultProps = {
	match: undefined,
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
})

const mapDispatchToProps = dispatch => ({
	setMessage: (message, type, details) => dispatch(setMessage(message, type, details)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ScoreEntryPage)
