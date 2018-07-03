import React from 'react'
import PropTypes from 'prop-types'
import { Form, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../../modules/Auth'
import { API_ROOT } from '../../config'
import { setUser } from '../../actions/userActions'

class LoginForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			email: '',
			password: '',
			message: '',
			loginSucess: false,
			redirect: false,
		}
	}

	handleChange = (e, { name, value }) => this.setState({ [name]: value })

	handleSubmit = e => {
		e.preventDefault()

		const { email, password } = this.state

		const payload = {
			email,
			password,
		}

		fetch(`${API_ROOT}/users/login`, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify(payload),
		})
			.then(data => {
				if (data.ok) return data.json()
				throw new Error()
			})
			.then(res => {
				Auth.storeToken(res.token)
				this.props.setUser(res.user)
				this.setState({
					redirect: true,
				})
			})
			.catch(err => new Error(err))
	}

	render() {
		const { password, email, redirect, message, loginSucess } = this.state

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
				{message && <Message error={!loginSucess} content={message} />}
				{redirect && <Redirect to="/profile" />}
			</div>
		)
	}
}

LoginForm.propTypes = {
	setUser: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
	setUser: user => dispatch(setUser(user)),
})

export default connect(
	null,
	mapDispatchToProps,
)(LoginForm)
