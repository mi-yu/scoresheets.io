import React from 'react'
import { Container, Header } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import errorImg from '../../assets/imgs/404.svg'

const errorBoundaryStyle = {
	height: '80vh',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
}

const imgStyle = {
	width: '15em',
	margin: '1em',
}

const NotFound = ({ titleMessage = 'That page doesn\'t exist!', bodyMessage }) => (
	<Container style={errorBoundaryStyle}>
		<Header as="h3">{titleMessage}</Header>
		{bodyMessage && <p>{bodyMessage}</p>}
		<img
			src={errorImg}
			alt="the current state of the scoresheets servers (very weird)"
			style={imgStyle}
		/>
	</Container>
)

NotFound.propTypes = {
	titleMessage: PropTypes.string.isRequired,
	bodyMessage: PropTypes.string.isRequired,
}

export default NotFound
