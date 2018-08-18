import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const TournamentEventActions = ({ eventId, division, tournamentId }) => {
	if (division !== 'BC') {
		return (
			<Button
				fluid
				basic
				as={Link}
				to={`/tournaments/${tournamentId}/events/${division}/${eventId}`}
			>
				Manage Scores
			</Button>
		)
	}
	return (
		<Button.Group fluid basic>
			<Button
				color="blue"
				as={Link}
				to={`/tournaments/${tournamentId}/events/B/${eventId}`}
			>
				B Scores
			</Button>
			<Button
				color="blue"
				as={Link}
				to={`/tournaments/${tournamentId}/events/C/${eventId}`}
			>
				C Scores
			</Button>
		</Button.Group>
	)
}

TournamentEventActions.propTypes = {
	eventId: PropTypes.string.isRequired,
	division: PropTypes.string.isRequired,
	tournamentId: PropTypes.string.isRequired,
}

export default TournamentEventActions
