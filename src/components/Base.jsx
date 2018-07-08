import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import Nav from './Nav'
import routes from '../routes'
import { hideMessage } from '../actions/messageActions'

class Base extends React.Component {
	render() {
		const { message, messageType, messageVisible, hideMessage } = this.props
		const messageColor =
			messageType === 'info' ? 'blue' : messageType === 'success' ? 'green' : 'red'
		return (
			<div>
				<Router>
					<div>
						<Nav />
						<Container>
							{routes.map((route, i) => (
								<Route
									exact
									key={i}
									path={route.path}
									render={props => <route.component {...props} />}
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
})

const mapDispatchToProps = dispatch => ({
	hideMessage: () => dispatch(hideMessage()),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Base)
