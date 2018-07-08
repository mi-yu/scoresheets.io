import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import { API_ROOT } from '../config'
import { setUser } from '../actions/userActions'

class ProfilePage extends React.Component {
	componentDidMount() {
		const { user, setUser } = this.props
		if (!Object.keys(user).length) {
			const token = Auth.getToken()
			fetch(`${API_ROOT}/users/me`, {
				method: 'GET',
				headers: new Headers({
					Authorization: `Bearer ${token}`,
				}),
			})
				.then(data => {
					if (data.ok) return data.json()
					throw new Error()
				})
				.then(res => {
					setUser(res)
				})
				.catch(err => {
					console.log(err)
				})
		}
	}

	render() {
		const { user, redirectToLogin } = this.props
		if (!user) return null
		if (redirectToLogin) return <Redirect to="/users/login" />

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
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ProfilePage)
