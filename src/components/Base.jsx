import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import { setMessage, hideMessage, showMessage } from '../actions/messageActions'
import { setEvents } from '../actions/eventActions'
import { setUser } from '../actions/userActions'
import { API_ROOT } from '../config'
import request from '../modules/request'
import arrayToObject from '../modules/arrayToObject'
import Auth from '../modules/Auth'
import Nav from './Nav'
import TournamentNav from './TournamentNav'
import HomePage from '../containers/HomePage'
import Footer from '../containers/Footer'
import routes from '../routes'
import { setTournaments } from '../actions/tournamentActions'
import ErrorBoundary from '../containers/errors/ErrorBoundary'
import NotFound from '../containers/errors/NotFound'

const translateMessageType = type => {
	switch (type) {
		case 'info':
			return 'blue'
		case 'success':
			return 'green'
		default:
			return 'red'
	}
}

class Base extends React.Component {
	componentDidMount() {
		const { setEvents, showMessage, setUser, setTournaments } = this.props

		if (Auth.isAuthenticated()) {
			const token = Auth.getToken()
			const urls = [`${API_ROOT}/events`, `${API_ROOT}/users/me`, `${API_ROOT}/tournaments`]
			const requests = urls.map(url => request(
				url, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			)

			Promise.all(requests)
				.then(([resEvents, resUser, resTournaments]) => {
					setEvents(arrayToObject(resEvents))
					setUser(resUser)
					setTournaments(arrayToObject(resTournaments))
				})
				.catch(err => {
					setMessage(err.message, 'error')
					showMessage()
				})
		}
	}

	render() {
		const { message, messageType, messageVisible, hideMessage, setMessage, messageDetails } = this.props
		const messageColor = translateMessageType(messageType)

		return (
			<div>
				<Router>
					<div>
						<div id="nav-wrapper">
							<Nav hidden={window.location.pathname.includes('slideshow')} />
							<Route path="/tournaments" component={TournamentNav} />
						</div>
						<ErrorBoundary>
							<Route exact path="/" component={HomePage} />
							<Container>
								<Switch>
									{routes.map(route => (
										<Route
											exact
											path={route.path}
											key={route.path}
											render={props => (
												<route.component {...props} setMessage={setMessage} />
											)}
										/>
									))}
									<Route component={NotFound} />
								</Switch>
							</Container>
							{messageVisible && (
								<Message
									onDismiss={hideMessage}
									color={messageColor}
								>
									{message}
									{messageDetails.length ? (
										<Message.List style={{
											textAlign: 'center',
										}}
										>
											{messageDetails.map(detail => <span>{detail}<br /></span>)}
										</Message.List>
									) : null
									}
								</Message>
							)}
							<Footer hidden={window.location.pathname.includes('slideshow')} />
						</ErrorBoundary>
					</div>
				</Router>
			</div>
		)
	}
}

Base.propTypes = {
	message: PropTypes.string.isRequired,
	messageType: PropTypes.string.isRequired,
	messageVisible: PropTypes.bool.isRequired,
	hideMessage: PropTypes.func.isRequired,
	messageDetails: PropTypes.arrayOf(PropTypes.string),
}

Base.defaultProps = {
	messageDetails: [],
}

const mapStateToProps = state => ({
	message: state.messages.message,
	messageVisible: state.messages.visible,
	messageType: state.messages.type,
	messageDetails: state.messages.details,
})

const mapDispatchToProps = dispatch => ({
	hideMessage: () => dispatch(hideMessage()),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	showMessage: () => dispatch(showMessage()),
	setEvents: events => dispatch(setEvents(events)),
	setUser: user => dispatch(setUser(user)),
	setTournaments: tournaments => dispatch(setTournaments(tournaments)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Base)
