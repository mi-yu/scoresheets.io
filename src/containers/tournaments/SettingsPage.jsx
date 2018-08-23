import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Checkbox } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Auth from '../../modules/Auth'
import request from '../../modules/request'
import { setMessage } from '../../actions/messageActions'
import { API_ROOT } from '../../config'

const checkboxWrapperStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}

const checkboxStyle = {
	marginLeft: '1em',
}

class SettingsPage extends React.Component {
	state = {
		loading: true,
	}

	componentDidMount() {
		const token = Auth.getToken()
		const { match } = this.props
		const { tournamentId } = match.params

		const urls = [`${API_ROOT}/tournaments/${tournamentId}/scoresheets`]

		const requests = urls.map(url => request(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}))

		Promise.all(requests)
			.then(([scoresheets]) => {
				const scoresheetsB = scoresheets
					.filter(scoresheet => scoresheet.division === 'B')

				const scoresheetsC = scoresheets
					.filter(scoresheet => scoresheet.division === 'C')

				const bResultsPublished = scoresheetsB.filter(scoresheet => !scoresheet.public).length === 0
				const cResultsPublished = scoresheetsC.filter(scoresheet => !scoresheet.public).length === 0

				this.setState({
					scoresheets,
					bResultsPublished,
					cResultsPublished,
					loading: false,
				})
			})
			.catch(err => {
				console.log(err)
			})
	}

	handleCheck = (e, { name, checked }) => {
		const { match, setMessage } = this.props
		const { tournamentId } = match.params
		const { scoresheets } = this.state
		const division = name === 'bResultsPublished' ? 'B' : 'C'
		const token = Auth.getToken()

		const requests = scoresheets
			.filter(scoresheet => scoresheet.division === division)
			.map(scoresheet => request(`${API_ROOT}/tournaments/${tournamentId}/scoresheets/${division}/${scoresheet.event._id}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					public: true,
				}),
			}))

		Promise.all(requests)
			.then(() => {
				setMessage(`Successfully made division ${division} scores ${checked ? 'public' : 'private'}.`, 'success')
				this.setState({
					[name]: checked,
				})
			})
			.catch(() => {
				setMessage(`There was a problem modifying privacy settings for division ${division} scores.`, 'error')
				this.setState({
					[name]: !checked,
				})
			})
	}

	render() {
		const { bResultsPublished, cResultsPublished, loading } = this.state
		if (loading) return null

		return (
			<div>
				<Grid style={{ marginTop: '2em' }}>
					<Grid.Row>
						<Grid.Column width={4}>
							<Header as="h3">Results</Header>
							<p>
								When toggled on, results for the corresponding division will be publicly available.
								This will only make final event ranks public (no raw scores).
							</p>
						</Grid.Column>
						<Grid.Column width={6} textAlign="center">
							<div style={checkboxWrapperStyle}>
								<label>B Results Published</label>
								<Checkbox
									style={checkboxStyle}
									toggle
									name="bResultsPublished"
									checked={bResultsPublished}
									onChange={this.handleCheck}
								/>
							</div>
							<div style={{ ...checkboxWrapperStyle, marginTop: '2em' }}>
								<label>C Results Published</label>
								<Checkbox
									style={checkboxStyle}
									toggle
									name="cResultsPublished"
									checked={cResultsPublished}
									onChange={this.handleCheck}
								/>
							</div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		)
	}
}

SettingsPage.propTypes = {
	setMessage: PropTypes.func.isRequired,
	match: PropTypes.shape({
		params: PropTypes.shape({
			tournamentId: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
}

const mapDispatchToProps = dispatch => ({
	setMessage: (message, type) => dispatch(setMessage(message, type)),
})

export default connect(null, mapDispatchToProps)(SettingsPage)
