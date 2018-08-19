import React from 'react'
import PropTypes from 'prop-types'
import { Table, Label } from 'semantic-ui-react'
import { connect } from 'react-redux'
import TournamentEventActions from './TournamentEventActions'

const TournamentEventRow = ({ event, tournament }) => {
	if (!event || !tournament) return null
	console.log(event)
	const { _id, division, name, stateEvent, impound } = event
	const { _id: tournamentId } = tournament
	return (
		<Table.Row>
			<Table.Cell>{name}</Table.Cell>
			<Table.Cell>
				{division.split('').map(div => <Label key={div} size="tiny">{div}</Label>)}
				{stateEvent && <Label size="tiny">trial</Label>}
				{impound && <Label size="tiny">impound</Label>}
			</Table.Cell>
			<Table.Cell>
				<TournamentEventActions eventId={_id} division={division} tournamentId={tournamentId} />
			</Table.Cell>
		</Table.Row>
	)
}

TournamentEventRow.propTypes = {
	event: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		division: PropTypes.string.isRequired,
		stateEvent: PropTypes.bool.isRequired,
		impound: PropTypes.bool.isRequired,
	}).isRequired,
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
	}).isRequired,
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
})

export default connect(mapStateToProps, null)(TournamentEventRow)
