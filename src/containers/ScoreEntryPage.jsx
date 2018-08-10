import React from 'react'
import PropTypes from 'prop-types'
import { Header, Button, Table, Form, Icon, Checkbox } from 'semantic-ui-react'
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
		sortBy: null,
		sortDir: null,
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

	handleSort = (clickedCol) => () => {
		const { sortBy, sortDir, scoresheetEntry } = this.state
		const { scores } = scoresheetEntry

		let sortedScores

		if (sortBy !== clickedCol) {
			if (clickedCol === 'teamNumber') {
				sortedScores = scores.sort((a, b) => a.team.teamNumber - b.team.teamNumber)
			} else if (clickedCol === 'rawScore') {
				sortedScores = scores.sort((a, b) => a.rawScore - b.rawScore)
			} else if (clickedCol === 'rank') {
				sortedScores = scores.sort((a, b) => a.rank - b.rank)
			}
		} else {
			sortedScores = scores.reverse()
		}

		this.setState({
			sortBy: clickedCol,
			sortDir: sortDir === 'ascending' ? 'descending' : 'ascending',
			scoresheetEntry: {
				...scoresheetEntry,
				scores: sortedScores,
			},
		})
	}


	submitScores = () => {
		const { scoresheetEntry } = this.state
		const { tournament, event, division } = scoresheetEntry
		const { setMessage } = this.props
		const url = `${API_ROOT}/tournaments/${tournament._id}/scoresheets/${division}/${event._id}`
		const token = Auth.getToken()

		const payload = scoresheetEntry
		if (!payload.scores) {
			return setMessage('Please fill in some scores before submitting.', 'info')
		}

		this.validateScores(payload.scores)
			.then(() => {
				request(url, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						scores: payload.scores,
					}),
				})
					.then(updated => {
						setMessage(`Successfully updated scores for ${event.name} ${division}`, 'success')
						this.setState({
							scoresheetEntry: updated,
						})
					})
					.catch(err => {
						setMessage(err.message, 'error')
					})
			})
			.catch(errors => {
				setMessage('There are unbroken ties:', 'error', this.translateScoresError(errors))
			})
	}

	translateScoresError = errors => errors.map(error => `${error.scoreA.team.displayName} is tied with ${error.scoreB.team.displayName}`)

	validateScores = scores => {
		const errors = []

		for (let scoreAIndex = 0; scoreAIndex < scores.length; scoreAIndex += 1) {
			for (let scoreBIndex = scoreAIndex + 1; scoreBIndex < scores.length; scoreBIndex += 1) {
				const scoreA = scores[scoreAIndex]
				const scoreB = scores[scoreBIndex]

				if (Number(scoreA.rawScore) === Number(scoreB.rawScore)
					&& Number(scoreA.tiebreaker) === Number(scoreB.tiebreaker)
					&& Number(scoreA.tier) === Number(scoreB.tier)) {
					/* eslint-disable */
					const { dq: dq_a, noShow: noShow_a, participationOnly: participationOnly_a, dropped: dropped_a } = scoreA
					const { dq: dq_b, noShow: noShow_b, participationOnly: participationOnly_b, dropped: dropped_b } = scoreB

					if (
						!dq_a && !dq_b && !noShow_a && !noShow_b
						&& !participationOnly_a && !participationOnly_b
						&& !dropped_a && !dropped_b
						/* eslint-enable */
					) {
						// TODO: add better messages
						errors.push({
							scoreA,
							scoreB,
						})
					}
				}
			}
		}

		return new Promise((resolve, reject) => {
			if (errors.length) return reject(errors)
			return resolve()
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
		const { scoresheetEntry, loading, sortDir, sortBy } = this.state
		const { scores } = scoresheetEntry
		if (loading) return null

		return (
			<div>
				<Header as="h1">{scoresheetEntry.event.name}</Header>
				<div
					style={{
						margin: '1em 0',
					}}
				>
					<label style={{ display: 'block' }}>Locked</label>
					<Checkbox toggle name="locked" checked={scoresheetEntry.locked} onChange={this.toggleScoresheetLock} />
				</div>
				<Link to={`/tournaments/${scoresheetEntry.tournament._id}/manage`}>
					<Icon name="long arrow left" />
					{`Back to ${scoresheetEntry.tournament.name}`}
				</Link>
				<Form style={{ margin: '2em 0' }}>
					<Table celled sortable>
						<Table.Header>
							<Table.Row>
								{/* TODO: make sortable */}
								<Table.HeaderCell
									sorted={sortBy === 'teamNumber' ? sortDir : null}
									onClick={this.handleSort('teamNumber')}
									width={3}
								>
									Team (School)
								</Table.HeaderCell>
								<Table.HeaderCell
									sorted={sortBy === 'rawScore' ? sortDir : null}
									onClick={this.handleSort('rawScore')}
									width={2}
								>
									Raw Score
								</Table.HeaderCell>
								<Table.HeaderCell
									width={2}
								>
									Tiebreaker
								</Table.HeaderCell>
								<Table.HeaderCell
									width={2}
								>
									Tier
								</Table.HeaderCell>
								<Table.HeaderCell
									width={3}
								>
									Drops/Penalties
								</Table.HeaderCell>
								<Table.HeaderCell
									width={3}
								>
									Notes
								</Table.HeaderCell>
								<Table.HeaderCell
									sorted={sortBy === 'rank' ? sortDir : null}
									onClick={this.handleSort('rank')}
								>
									Rank
								</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{scores.map((score, i) => (
								<Table.Row>
									<Table.Cell>
										{`${score.team.division}${score.team.teamNumber} (${
											score.team.displayName
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
	setMessage: (message, type, details) => dispatch(setMessage(message, type, details)),
})

export default connect(
	null,
	mapDispatchToProps,
)(ScoreEntryPage)
