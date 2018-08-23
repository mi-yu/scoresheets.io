import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Container, Item } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import { setCurrentTournament } from '../actions/tournamentActions'
import { setMessage } from '../actions/messageActions'
import { API_ROOT } from '../config'
import request from '../modules/request'

class TournamentNav extends React.Component {
	componentDidMount() {
		// TODO: fix this hack
		const { tournament, setCurrentTournament, setMessage } = this.props
		const tournamentId = window.location.pathname.split('/')[2]
		if (!Object.keys(tournament).length && Auth.isAuthenticated()) {
			const token = Auth.getToken()
			request(`${API_ROOT}/tournaments/${tournamentId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then(tournamentRes => {
					setCurrentTournament(tournamentRes)
				})
				.catch(err => {
					console.log(err)
					setMessage('There was a problem contacting the server, try again later.', 'error')
				})
		}
	}

	render() {
		const { tournament } = this.props

		if (!tournament._id || window.location.pathname.includes('slideshow')) return null
		if (!Auth.isAuthenticated()) return null

		return (
			<div id="tournament-nav">
				<Menu
					borderless
				>
					<Container style={{ paddingTop: '0' }}>
						<Link to={`/tournaments/${tournament._id}`}>
							<Item>
								{tournament.name}
							</Item>
						</Link>
						<Link to={`/tournaments/${tournament._id}/events`}>
							<Item
								name="Events"
							>
								Events
							</Item>
						</Link>
						<Link to={`/tournaments/${tournament._id}/teams`}>
							<Item
								name="Teams"
							>
								Teams
							</Item>
						</Link>
						<Link to="/">
							<Item
								name="Results"
							>
								Results
							</Item>
						</Link>
						{/* <Link to={`/tournaments/${tournament._id}/settings`}>
							<Item
								name="Settings"
							>
								Settings
							</Item>
						</Link> */}
					</Container>
				</Menu>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
})

const mapDispatchToProps = dispatch => ({
	setCurrentTournament: tournament => dispatch(setCurrentTournament(tournament)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
})

TournamentNav.propTypes = {
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
	setMessage: PropTypes.func.isRequired,
	setCurrentTournament: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(TournamentNav)
