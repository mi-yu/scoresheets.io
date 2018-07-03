import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import Nav from './Nav'

import routes from '../routes'

class Base extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: props.user || {},
			messageVisible: false,
			message: '',
			messageStatus: '',
		}
	}

	handleDismissMessage = () => {
		this.setState({
			messageVisible: false,
		})
	}

	setMessage = (msg, status) => {
		this.setState({
			message: msg,
			messageStatus: status,
			messageVisible: true,
		})
	}

	render() {
		const { message, messageStatus, messageVisible } = this.state
		const messageColor =
			messageStatus === 'info' ? 'blue' : messageStatus === 'success' ? 'green' : 'red'
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
									render={props => (
										<route.component setMessage={this.setMessage} {...props} />
									)}
								/>
							))}
							{messageVisible && (
								<Message
									onDismiss={this.handleDismissMessage}
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
	token: PropTypes.string,
	user: PropTypes.object,
}

const mapStateToProps = state => ({
	...state,
})

export default connect(
	mapStateToProps,
	null,
)(Base)
