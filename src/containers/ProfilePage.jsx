import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import { API_ROOT } from '../config'
import { setUser } from '../actions/userActions'
import { setMessage, showMessage } from '../actions/messageActions'
import request from '../modules/request'

class ProfilePage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			redirectToLogin: false,
		}
	}

	componentDidMount() {
		const { user, setUser, setMessage, showMessage } = this.props
		if (!Object.keys(user).length) {
			const token = Auth.getToken()
			request(`${API_ROOT}/users/me`, {
				method: 'GET',
				headers: new Headers({
					Authorization: `Bearer ${token}`,
				}),
			})
				.then(res => {
					setUser(res)
				})
				.catch(errResponse => {
					errResponse.json().then(err => {
						setMessage(err.message, 'error')
						showMessage()
						this.setState({
							redirectToLogin: true,
						})
					})
				})
		}
	}

	render() {
		const { user } = this.props
		const { redirectToLogin } = this.state
		if (redirectToLogin) return <Redirect to="/users/login" />
		if (!Object.keys(user).length) return null

		return (
			<div>
				<h1>id: {user._id}</h1>
				<h1>Name: {`${user.firstName} ${user.lastName}`}</h1>
				<h1>Email: {user.email}</h1>
			</div>
		)
	}
}

ProfilePage.propTypes = {
	user: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		email: PropTypes.string,
	}).isRequired,
}

const mapStateToProps = state => ({
	user: state.users.currentUser,
})

const mapDispatchToProps = dispatch => ({
	setUser: user => dispatch(setUser(user)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	showMessage: () => dispatch(showMessage()),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ProfilePage)
