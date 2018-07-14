import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import Nav from './Nav'
import routes from '../routes'
import { setMessage, hideMessage, showMessage } from '../actions/messageActions'
import { setEvents } from '../actions/eventActions'
import request from '../modules/request'
import arrayToObject from '../modules/arrayToObject'
import Auth from '../modules/Auth'
import { API_ROOT } from '../config'

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
		const { events, setEvents, showMessage } = this.props
		const token = Auth.getToken()
		if (!Object.keys(events).length && token) {
			request(`${API_ROOT}/events`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then(res => setEvents(arrayToObject(res)))
				.catch(err => {
					setMessage(err.message, 'error')
					showMessage()
				})
		}
	}

	render() {
		const { message, messageType, messageVisible, hideMessage, setMessage, events } = this.props
		const messageColor = translateMessageType(messageType)

		if (!Object.keys(events).length && Auth.isAuthenticated()) return null

		return (
			<div>
				<Router>
					<div>
						<Nav />
						<Container>
							{routes.map(route => (
								<Route
									exact
									path={route.path}
									render={props => (
										<route.component
											{...props}
											setMessage={setMessage}
										/>
									)}
								/>
							))}
							{messageVisible && (
								<Message
									onDismiss={hideMessage}
									content={message}
									color={messageColor}
								/>
							)}
						</Container>
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
}

const mapStateToProps = state => ({
	message: state.messages.message,
	messageVisible: state.messages.visible,
	messageType: state.messages.type,
	events: state.events.eventList,
})

const mapDispatchToProps = dispatch => ({
	hideMessage: () => dispatch(hideMessage()),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	showMessage: () => dispatch(showMessage()),
	setEvents: events => dispatch(setEvents(events)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Base)
