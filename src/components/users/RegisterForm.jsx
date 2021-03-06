import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import request from '../../modules/request'
import { setMessage } from '../../actions/messageActions'
import { setUser } from '../../actions/userActions'
import { API_ROOT } from '../../config'

class RegisterForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			group: 'director',
			tournamentCode: '',
			firstName: '',
			lastName: '',
			password: '',
			email: '',
			redirectToLogin: false,
			submitDisabled: false,
		}
	}

	handleChange = (e, { name, value }) => {
		this.setState({
			[name]: value,
		})
	}

	handleGroupSelect = group => {
		this.setState({
			group,
			submitDisabled: group === 'supervisor',
		})
	}

	handleSubmit = () => {
		const { setMessage, setUser } = this.props
		const { redirectToLogin, ...rest } = this.state
		const url = `${API_ROOT}/users`

		request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(rest),
		})
			.then(user => {
				setMessage('Registration successful', 'success')
				setUser(user)
				this.setState({
					redirectToLogin: true,
				})
			})
			.catch(err => {
				if (err.name === 'DuplicateError') {
					setMessage('That email is already taken.', 'error')
				} else if (err.name === 'ValidationError') {
					setMessage(this.translateValidationError(err), 'error')
				} else setMessage(err.message, 'error')
			})
	}

	translateValidationError = err => {
		let message = `${err.message}\n Please check the following fields: `
		err.fields.forEach(field => {
			message += field.field
		})
		return message
	}

	renderDirectorFields = () => (
		<div>
			<small>Disclaimer: Scoresheets is a side-project in alpha and under rapid development.
				It is strongly recommended to have abackup score management system running alongside Scoresheets
				such as Excel, Google Sheets, and so on.
			</small>
		</div>
	)

	renderSupervisorFields = () => {
		const { tournamentCode } = this.state
		return (
			<div>
				<p>Coming soon!</p>
				<Form.Field disabled>
					<label htmlFor="tournament code">Tournament code</label>
					<Form.Input
						name="tournamentCode"
						value={tournamentCode}
						onChange={this.handleChange}
					/>
					<small>Ask your tournament director for this code.</small>
				</Form.Field>
			</div>
		)
	}

	render() {
		const {
			group,
			firstName,
			lastName,
			password,
			email,
			redirectToLogin,
			submitDisabled,
		} = this.state
		if (redirectToLogin) return <Redirect to="/users/login" />

		return (
			<Form>
				<Form.Field required>
					<label htmlFor="email">Email</label>
					<Form.Input name="email" value={email} onChange={this.handleChange} required />
				</Form.Field>
				<Form.Field required>
					<label htmlFor="password">Password</label>
					<Form.Input
						type="password"
						name="password"
						value={password}
						onChange={this.handleChange}
						required
					/>
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
				<Form.Field required>
					<label htmlFor="group">Which role best describes you?</label>
					<Button.Group fluid>
						<Button
							color={group === 'director' ? 'grey' : ''}
							onClick={() => this.handleGroupSelect('director')}
						>
							Tournament Director
						</Button>
						<Button
							color={group === 'supervisor' ? 'grey' : ''}
							onClick={() => this.handleGroupSelect('supervisor')}
						>
							Event Supervisor
						</Button>
					</Button.Group>
				</Form.Field>
				{group === 'director' && this.renderDirectorFields()}
				{group === 'supervisor' && this.renderSupervisorFields()}
				<Button color="green" onClick={this.handleSubmit} disabled={submitDisabled} style={{ marginTop: '1em' }}>
					Submit
				</Button>
			</Form>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	setUser: user => dispatch(setUser(user)),
})

export default connect(
	null,
	mapDispatchToProps,
)(RegisterForm)
