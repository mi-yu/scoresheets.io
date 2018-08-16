import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Container, Item, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const TournamentNav = ({ tournament }) => (
	<div id="tournament-nav">
		{/* <Container style={{ paddingTop: '1em' }}>
			<Item id="tournament-nav-name">{tournament.name}</Item>
		</Container> */}
		<Menu
			borderless
		>
			<Container style={{ paddingTop: '0' }}>
				<Link to={`/tournaments/${tournament._id}`}>
					<Item>
						{tournament.name}
					</Item>
				</Link>
				<Link to="/">
					<Item
						name="Teams"
					>
						Teams
					</Item>
				</Link>
				<Link to="/">
					<Item
						name="Events"
					>
						Events
					</Item>
				</Link>
				<Link to="/">
					<Item
						name="Results"
					>
						Results
					</Item>
				</Link>
			</Container>
		</Menu>
	</div>
)

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
