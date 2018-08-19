import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Link } from 'react-router-dom'
import { Header, Button, Icon, Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import request from '../modules/request'
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
		].map(url => request(url, {
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

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value })
	}

	render() {
		const { tournament } = this.props
		const {
			redirectToLogin,
			numAwards,
			loading,
		} = this.state

		if (redirectToLogin) return <Redirect to="/users/login" />
		if (loading) return null

		return (
			<div>
				<Header as="h1">{tournament.name}</Header>
				<p>{new Date(tournament.date).toLocaleDateString()}</p>
				<p>{`${tournament.city}, ${tournament.state}`}</p>
				<Button
					basic
					size="tiny"
					primary
					as={Link}
					to={{
						pathname: `/tournaments/${tournament._id}/B/results`,
					}}
				>
					<Icon name="trophy" />
					B Results
				</Button>
				<Button
					basic
					size="tiny"
					primary
					as={Link}
					to={{
						pathname: `/tournaments/${tournament._id}/C/results`,
					}}
				>
					<Icon name="trophy" />
					C Results
				</Button>
				<Button.Group size="tiny">
					<Dropdown
						button
						text={numAwards ? `${numAwards} awards` : 'Choose number of awards'}
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
						rel="noopener noreferrer"
						target="_blank"
					>
						{'Start Awards Presentation'}
						<Icon name="right arrow" />
					</Button>
				</Button.Group>
			</div>
		)
	}
}

TournamentManagementPage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.object.isRequired,
	}),
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
	}),
	setMessage: PropTypes.func.isRequired,
	setCurrentTournament: PropTypes.func.isRequired,
}

TournamentManagementPage.defaultProps = {
	match: {},
	tournament: {},
}

const mapStateToProps = state => ({
	events: state.events.eventList,
	tournament: state.tournaments.currentTournament,
	currentTeamId: state.teams.currentTeamId,
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
