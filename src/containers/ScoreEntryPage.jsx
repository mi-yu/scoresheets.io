import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Checkbox, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import request from '../modules/request'
import { setMessage } from '../actions/messageActions'
import { API_ROOT } from '../config'
import ScoreEntryForm from '../components/tournaments/ScoreEntryForm'

class ScoreEntryPage extends React.Component {
	state = {
		scoresheetEntry: {
			scores: [],
		},
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
		const { scoresheetEntry, loading } = this.state
		const { scores } = scoresheetEntry
		if (loading || !scores.length) return null

		return (
			<div>
				<Breadcrumb>
					<Breadcrumb.Section>
						<Link to={`/tournaments/${scoresheetEntry.tournament._id}/manage`}>
							{scoresheetEntry.tournament.name}
						</Link>
					</Breadcrumb.Section>
					<Breadcrumb.Divider />
					<Breadcrumb.Section>
						{scoresheetEntry.event.name}
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
					<label style={{ fontSize: '1.2em', marginRight: '1em' }}>Lock Scores</label>
					<Checkbox toggle name="locked" checked={scoresheetEntry.locked} onChange={this.toggleScoresheetLock} />
				</div>
				{
					scores.length === 0 ? (
						<Segment size="large" textAlign="center">
							There are no division {scoresheetEntry.division} teams in this tournament.
						</Segment>
					) : (
						<ScoreEntryForm scoresheetEntry={scoresheetEntry} />
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
}

ScoreEntryPage.defaultProps = {
	match: undefined,
}

const mapDispatchToProps = dispatch => ({
	setMessage: (message, type, details) => dispatch(setMessage(message, type, details)),
})

export default connect(
	null,
	mapDispatchToProps,
)(ScoreEntryPage)
