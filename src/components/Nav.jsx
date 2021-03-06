import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu, Item, Container } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import { setUser } from '../actions/userActions'
import { clearCurrentTournament, setTournaments } from '../actions/tournamentActions'

class Nav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeItem: window.location.pathname,
		}
	}

	handleClick = e => this.setState({ activeItem: e.target.innerHTML.toLowerCase() })

	handleLogout = () => {
		const { setUser, clearCurrentTournament, setTournaments } = this.props
		Auth.removeToken()
		setUser({})
		clearCurrentTournament()
		setTournaments({})
		return <Redirect to="/" />
	}

	calculateNavClassNames = () => {
		const { activeItem } = this.state
		const activeClass = activeItem.includes('scoresheets') || activeItem === '/' ? 'menu-home' : ''
		const loggedInClass = Auth.isAuthenticated() ? 'nav-logged-in' : ''

		return `${activeClass} ${loggedInClass}`
	}

	render() {
		const { activeItem } = this.state
		const { hidden } = this.props

		const loggedIn = Auth.isAuthenticated()
		const classNames = this.calculateNavClassNames()

		// TODO: get this to actually work
		if (hidden) return null

		return (
			<Menu
				id="main-nav"
				borderless
				attached="top"
				className={classNames}
			>
				<Container style={{ paddingTop: '0' }}>
					<Link to="/" onClick={this.handleClick}>
						<Item
							name="Scoresheets"
							className={
								activeItem.includes('scoresheets') || activeItem === '/'
									? 'active'
									: ''
							}
						>
							Scoresheets
							<div className="nav-version">alpha</div>
						</Item>
					</Link>

					{loggedIn ? (
						<Menu.Menu position="right">
							<Link to="/dashboard" onClick={this.handleClick}>
								<Item
									name="Dashboard"
									className={activeItem.includes('dashboard') ? 'active' : ''}
								>
									Dashboard
								</Item>
							</Link>
							<Link to="/profile" onClick={this.handleClick}>
								<Item
									name="Profile"
									className={activeItem.includes('profile') ? 'active' : ''}
								>
									Profile
								</Item>
							</Link>
							<Link to="/" onClick={this.handleLogout}>
								<Item
									name="Logout"
								>
									Logout
								</Item>
							</Link>
						</Menu.Menu>
					) : (
						<Menu.Menu borderless position="right">
							<Link to="/users/login" onClick={this.handleClick}>
								<Item
									name="Login"
									className={activeItem.includes('login') ? 'active' : ''}
								>
										Login
         </Item>
							</Link>
							<Link to="/users/register" onClick={this.handleClick}>
								<Item
									name="Register"
									className={activeItem.includes('register') ? 'active' : ''}
								>
										Register
									</Item>
							</Link>
						</Menu.Menu>
					)}
				</Container>
			</Menu>
		)
	}
}

Nav.propTypes = {
	setUser: PropTypes.func.isRequired,
	hidden: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
	user: state.users.currentUser,
	tournament: state.tournaments.currentTournament,
})

const mapDispatchToProps = dispatch => ({
	setUser: user => dispatch(setUser(user)),
	clearCurrentTournament: () => dispatch(clearCurrentTournament()),
	setTournaments: tournament => dispatch(setTournaments(tournament)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Nav)
