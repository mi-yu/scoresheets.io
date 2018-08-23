import React from 'react'
import PropTypes from 'prop-types'
import NotFound from './NotFound'

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			error: false,
		}
	}

	componentDidCatch() {
		this.setState({ error: true })
	}

	render() {
		const { error } = this.state
		const { children } = this.props

		if (error) return <NotFound titleMessage="Something broke!" bodyMessage="Try refreshing the page, a fix is probably coming soon." />

		return children
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.element.isRequired,
}

export default ErrorBoundary
