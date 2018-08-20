import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Container, Item } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'

const TournamentNav = ({ tournament }) => {
	if (!tournament || window.location.pathname.includes('slideshow')) return null
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
					<Link to={`/tournaments/${tournament._id}/settings`}>
						<Item
							name="Settings"
						>
							Settings
						</Item>
					</Link>
				</Container>
			</Menu>
		</div>
	)
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
})

TournamentNav.propTypes = {
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
}

export default connect(mapStateToProps, null)(TournamentNav)
