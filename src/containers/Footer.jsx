import React from 'react'
import PropTypes from 'prop-types'

const footerStyle = {
	height: '8em',
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'flex-end',
}

const tagStyle = {
	opacity: 0.7,
	padding: '1.5em',
	fontSize: '75%',
}

const Footer = ({ hidden }) => {
	if (!hidden) {
		return (
			<footer style={footerStyle}>
				<span style={tagStyle}>Made with ☕ and 💕 in ATX</span>
			</footer>
		)
	}
	return null
}

Footer.propTypes = {
	hidden: PropTypes.bool.isRequired,
}

export default Footer
