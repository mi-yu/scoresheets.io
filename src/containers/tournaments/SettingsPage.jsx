import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class SettingsPage extends React.Component {
	render() {
		const { tournament } = this.props
		return (
			<div>{tournament.public.toString()}</div>
		)
	}
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
})

export default connect(mapStateToProps, null)(SettingsPage)
