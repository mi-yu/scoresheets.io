import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import Nav from './Nav'
import routes from '../routes'
import { setMessage, hideMessage } from '../actions/messageActions'

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

const Base = ({ message, messageType, messageVisible, hideMessage, setMessage }) => {
	const messageColor = translateMessageType(messageType)
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
})

const mapDispatchToProps = dispatch => ({
	hideMessage: () => dispatch(hideMessage()),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Base)
