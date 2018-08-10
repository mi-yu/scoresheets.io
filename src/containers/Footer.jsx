import React from 'react'

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

const Footer = () => (
	<footer style={footerStyle}>
		<span style={tagStyle}>Made with ☕ and 💕 in ATX</span>
	</footer>
)

export default Footer
