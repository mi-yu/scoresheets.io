import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu, Item, Container } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import { setUser } from '../actions/userActions'

const activeStyle = {
	borderBottom: '1px solid black',
	color: 'black',
}

class Nav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeItem: window.location.pathname,
		}
	}

	handleClick = e => this.setState({ activeItem: e.target.innerHTML.toLowerCase() })

	handleLogout = () => {
		const { setUser } = this.props
		Auth.removeToken()
		setUser({})
		return <Redirect to="/" />
	}

	render() {
		const { activeItem } = this.state
		const { user } = this.props

		const loggedIn = Auth.isAuthenticated() && Object.keys(user).length !== 0

		return (
			<Container style={{ paddingTop: '0' }}>
				<Menu
					borderless
					attached="top"
					style={{
						borderLeft: 'none',
						borderRight: 'none',
						borderTop: 'none',
					}}
					color="black"
				>
					<Item
						name="Scribe"
						onClick={this.handleClick}
						style={
							activeItem.includes('scribe') || activeItem === '' ? activeStyle : {}
						}
					>
						<Link to="/">Scribe</Link>
					</Item>

					{loggedIn ? (
						<Menu.Menu borderless position="right" color="black">
							<Item
								name="Dashboard"
								style={activeItem.includes('dashboard') ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/admin/dashboard">Dashboard</Link>
							</Item>
							<Item
								name="Profile"
								style={activeItem.includes('profile') ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/profile">Profile</Link>
							</Item>
							<Item
								name="Logout"
								style={activeItem.includes('logout') ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/" onClick={this.handleLogout}>
									Logout
								</Link>
							</Item>
						</Menu.Menu>
					) : (
						<Menu.Menu borderless position="right" color="black">
							<Item
								name="Login"
								style={activeItem.includes('login') ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/users/login">Login</Link>
							</Item>
							<Item
								name="Register"
								style={activeItem.includes('register') ? activeStyle : {}}
								onClick={this.handleClick}
							>
								<Link to="/users/register">Register</Link>
							</Item>
						</Menu.Menu>
					)}
				</Menu>
			</Container>
		)
	}
}

Nav.propTypes = {
	setUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	user: state.users.currentUser,
})

const mapDispatchToProps = dispatch => ({
	setUser: user => dispatch(setUser(user)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Nav)
