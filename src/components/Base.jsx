import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import Nav from './Nav'
import HomePage from '../containers/HomePage'
import routes from '../routes'
import { setMessage, hideMessage, showMessage } from '../actions/messageActions'
import { setEvents } from '../actions/eventActions'
import { setUser } from '../actions/userActions'
import request from '../modules/request'
import arrayToObject from '../modules/arrayToObject'
import Auth from '../modules/Auth'
import { API_ROOT } from '../config'
import Footer from '../containers/Footer'

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
		const { setEvents, showMessage, setUser } = this.props

		if (Auth.isAuthenticated()) {
			const token = Auth.getToken()
			const urls = [`${API_ROOT}/events`, `${API_ROOT}/users/me`]
			const requests = urls.map(url => request(
				url, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			)

			Promise.all(requests)
				.then(([resEvents, resUser]) => {
					setEvents(arrayToObject(resEvents))
					setUser(resUser)
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
						<Nav hidden={window.location.pathname.includes('slideshow')} />
						<Route exact path="/" component={HomePage} />
						{routes.map(route => (
							<Route
								exact
								path={route.path}
								render={props => (
									<Container><route.component {...props} setMessage={setMessage} /></Container>
								)}
							/>
						))}
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
						<Footer />
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
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Base)
