import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../../modules/Auth'
import request from '../../modules/request'
import { API_ROOT } from '../../config'
import { setUser } from '../../actions/userActions'
import { setMessage, showMessage } from '../../actions/messageActions'
import { setTournaments } from '../../actions/tournamentActions'
import { setEvents } from '../../actions/eventActions'
import arrayToObject from '../../modules/arrayToObject'

class LoginForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			email: '',
			password: '',
			redirect: false,
		}
	}

	handleChange = (e, { name, value }) => this.setState({ [name]: value })

	handleSubmit = e => {
		e.preventDefault()

		const { setUser, setMessage, showMessage, setTournaments, setEvents } = this.props
		const { email, password } = this.state
		const payload = {
			email,
			password,
		}

		request(`${API_ROOT}/users/login`, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify(payload),
		})
			.then(response => {
				Auth.storeToken(response.token)
				setUser(response.user)
				this.setState({
					redirect: true,
				})
			})
			.catch(err => {
				setMessage(err.message, 'error')
			})
	}

	render() {
		const { password, email, redirect } = this.state

		if (redirect) return <Redirect to="/admin/dashboard" />

		return (
			<div>
				<Form onSubmit={this.handleSubmit}>
					<Form.Field required>
						<label htmlFor="email">Email</label>
						<Form.Input
							placeholder="Email"
							name="email"
							value={email}
							onChange={this.handleChange}
						/>
					</Form.Field>
					<Form.Field required>
						<label htmlFor="password">Password</label>
						<Form.Input
							type="password"
							name="password"
							value={password}
							onChange={this.handleChange}
						/>
					</Form.Field>
					<Form.Button content="Submit" color="blue" />
				</Form>
			</div>
		)
	}
}

LoginForm.propTypes = {
	setUser: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
	setUser: user => dispatch(setUser(user)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	showMessage: () => dispatch(showMessage()),
	setTournaments: tournaments => dispatch(setTournaments(tournaments)),
	setEvents: events => dispatch(setEvents(events)),
})

export default connect(
	null,
	mapDispatchToProps,
)(LoginForm)
