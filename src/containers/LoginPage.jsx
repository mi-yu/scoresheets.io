import React from 'react'
import { Header } from 'semantic-ui-react'
import LoginForm from '../components/users/LoginForm'

const centered = {
	width: '50%',
	margin: '0 auto',
}

const LoginPage = () => (
	<div style={centered}>
		<Header as="h1">Login</Header>
		<LoginForm />
	</div>
)

export default LoginPage
