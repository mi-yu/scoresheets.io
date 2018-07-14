import React from 'react'
import PropTypes from 'prop-types'
import { Header, Button, Table, Form, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import request from '../modules/request'
import { setMessage } from '../actions/messageActions'
import { API_ROOT } from '../config'

const tierOptions = [...Array(5)].map((n, i) => ({ value: i + 1, text: String(i + 1) }))

class ScoreEntryPage extends React.Component {
	state = {
		scoresheetEntry: {
			scores: [],
		},
		loading: true,
	}

	componentDidMount() {
		const { setMessage } = this.props
		const { tournamentId, eventId, division } = this.props.match.params
		const token = Auth.getToken()
		const urls = [`${API_ROOT}/tournaments/${tournamentId}/scoresheets/${division}/${eventId}`]

		const requests = urls.map(url =>
			request(url, {
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

	handleChange = (e, { scoreindex, name, value }) => {
		const { scoresheetEntry } = this.state
		const { scores } = scoresheetEntry
		scores[scoreindex] = {
			...scores[scoreindex],
			[name]: value,
		}
		this.setState({
			scoresheetEntry: {
				...scoresheetEntry,
				scores,
			},
		})
	}

	handleCheck = (e, { scoreindex, name, checked }) => {
		const { scoresheetEntry } = this.state
		const { scores } = scoresheetEntry
		scores[scoreindex] = { ...scores[scoreindex], [name]: checked }
		this.setState({ scoresheetEntry: { ...scoresheetEntry, scores } })
	}

	submitScores = () => {
		const { scoresheetEntry, setMessage } = this.state
		const url = `${API_ROOT}/scoresheets/${scoresheetEntry._id}/update`
		const eventName = scoresheetEntry.event.name
		const token = Auth.getToken()
		const payload = JSON.stringify({
			scores: scoresheetEntry.scores,
			eventName,
		})

		fetch(url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			}),
			body: payload,
		})
			.then(data => {
				if (data.ok) return data.json()
				throw new Error()
			})
			.then(res => {
				if (res.message.error) setMessage(res.message.error, 'error')
				else {
					setMessage(res.message.success, 'success')
					this.setState(this.state)
				}
			})
			.catch(err => {
				setMessage(err, 'error')
			})
	}

	render() {
		const { scoresheetEntry, loading } = this.state
		if (loading) return null
		return (
			<div>
				<Header as="h1">{scoresheetEntry.event.name}</Header>
				<Header color="blue">
					<Link to={`/tournaments/${scoresheetEntry.tournament._id}/manage`}>
						<Icon name="long arrow left" />
						{scoresheetEntry.tournament.name}
					</Link>
				</Header>
				<Form>
					<Table celled>
						<Table.Header>
							<Table.Row>
								{/* TODO: make sortable */}
								<Table.HeaderCell width={3}>Team (School)</Table.HeaderCell>
								<Table.HeaderCell width={2}>Raw Score</Table.HeaderCell>
								<Table.HeaderCell width={2}>Tiebreaker</Table.HeaderCell>
								<Table.HeaderCell width={2}>Tier</Table.HeaderCell>
								<Table.HeaderCell width={3}>Drops/Penalties</Table.HeaderCell>
								<Table.HeaderCell width={3}>Notes</Table.HeaderCell>
								<Table.HeaderCell>Rank</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{scoresheetEntry.scores.map((score, i) => (
								<Table.Row>
									<Table.Cell>
										{`${score.team.division}${score.team.teamNumber} (${
											score.team.school
										})`}
									</Table.Cell>
									<Table.Cell>
										<Form.Input
											name="rawScore"
											scoreindex={i}
											fluid
											type="number"
											value={score.rawScore}
											onChange={this.handleChange}
										/>
									</Table.Cell>
									<Table.Cell>
										<Form.Input
											name="tiebreaker"
											scoreindex={i}
											fluid
											type="number"
											value={score.tiebreaker}
											onChange={this.handleChange}
										/>
									</Table.Cell>
									<Table.Cell>
										<Form.Dropdown
											name="tier"
											scoreindex={i}
											fluid
											selection
											value={score.tier}
											onChange={this.handleChange}
											options={tierOptions}
										/>
									</Table.Cell>
									<Table.Cell>
										<Form.Group>
											<Form.Checkbox
												name="dropped"
												label="Dropped"
												width={8}
												checked={score.dropped}
												scoreindex={i}
												onChange={this.handleCheck}
											/>
											<Form.Checkbox
												name="participationOnly"
												label="PP"
												width={8}
												checked={score.participationOnly}
												scoreindex={i}
												onChange={this.handleCheck}
											/>
										</Form.Group>
										<Form.Group>
											<Form.Checkbox
												width={8}
												name="noShow"
												label="NS"
												checked={score.noShow}
												scoreindex={i}
												onChange={this.handleCheck}
											/>
											<Form.Checkbox
												width={8}
												name="dq"
												label="DQ"
												checked={score.dq}
												scoreindex={i}
												onChange={this.handleCheck}
											/>
										</Form.Group>
									</Table.Cell>
									<Table.Cell>
										<Form.TextArea
											name="notes"
											scoreindex={i}
											fluid
											value={score.notes}
											onChange={this.handleChange}
										/>
									</Table.Cell>
									<Table.Cell textAlign="center">{score.rank}</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					<Button type="submit" color="green" onClick={this.submitScores}>
						Save Scores
					</Button>
				</Form>
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
	setMessage: (message, type) => dispatch(setMessage(message, type)),
})

export default connect(
	null,
	mapDispatchToProps,
)(ScoreEntryPage)
