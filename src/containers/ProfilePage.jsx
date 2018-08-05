import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Header, Button } from 'semantic-ui-react'
import Auth from '../modules/Auth'
import { API_ROOT } from '../config'
import { setUser } from '../actions/userActions'
import { setMessage, showMessage } from '../actions/messageActions'
import request from '../modules/request'

const centered = {
	width: '50%',
	margin: '0 auto',
}

class ProfilePage extends React.Component {
	constructor(props) {
		super(props)
		const { user } = props
		this.state = {
			redirectToLogin: false,
			...user,
		}
	}

	componentDidMount() {
		const { user, setUser, setMessage, showMessage } = this.props
		if (!Object.keys(user).length) {
			const token = Auth.getToken()
			request(`${API_ROOT}/users`, {
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

	handleChange = (e, { name, value }) => {
		this.setState({
			[name]: value,
		})
	}

	handleSubmit = () => {
		const { setMessage, setUser } = this.props
		const { _id, email, firstName, lastName } = this.state
		const url = `${API_ROOT}/users/${_id}`
		const token = Auth.getToken()

		request(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				_id,
				email,
				firstName,
				lastName,
			}),
		})
			.then(user => {
				setMessage('Profile details successfully updated', 'success')
				setUser(user)
			})
			.catch(err => {
				if (err.name === 'DuplicateError') {
					setMessage('That email is already taken.', 'error')
				} else if (err.name === 'ValidationError') {
					setMessage(this.translateValidationError(err), 'error')
				} else setMessage(err.message, 'error')
			})
	}

	render() {
		const { user } = this.props
		if (!Object.keys(user).length) return null

		const { email, firstName, lastName, redirectToLogin } = this.state
		if (redirectToLogin) return <Redirect to="/users/login" />

		return (
			<div>
				<Form style={centered}>
					<Header as="h2">Edit your profile</Header>
					<Form.Field required>
						<label htmlFor="email">Email</label>
						<Form.Input name="email" value={email} onChange={this.handleChange} required />
					</Form.Field>
					<Form.Field>
						<label htmlFor="password">Password (changing password not yet supported)</label>
						<Form.Input disabled />
					</Form.Field>
					<Form.Group>
						<Form.Field width={8} required>
							<label htmlFor="first name">First Name</label>
							<Form.Input
								name="firstName"
								value={firstName}
								onChange={this.handleChange}
								required
							/>
						</Form.Field>
						<Form.Field width={8} required>
							<label htmlFor="last name">Last Name</label>
							<Form.Input name="lastName" value={lastName} onChange={this.handleChange} required />
						</Form.Field>
					</Form.Group>
					<Button color="green" onClick={this.handleSubmit}>
						Submit
					</Button>
				</Form>
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
