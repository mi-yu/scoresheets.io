import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import TournamentEventCard from './TournamentEventCard'

const TournamentEventGrid = ({ events, tournament, eventList }) => (
	<Grid>
		{events.map(eventId => (
			<TournamentEventCard
				key={eventId}
				{...eventList[eventId]}
				tournamentId={tournament._id}
			/>
		),
		)}
	</Grid>
)

TournamentEventGrid.propTypes = {
	events: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
	})).isRequired,
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
	}).isRequired,
	eventList: PropTypes.objectOf(PropTypes.object).isRequired,
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
	eventList: state.events.eventList,
})

export default connect(mapStateToProps, null)(TournamentEventGrid)
