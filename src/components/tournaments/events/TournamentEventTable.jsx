import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import { connect } from 'react-redux'
import TournamentEventRow from './TournamentEventRow'

const TeamTable = ({ events, eventList }) => (
	<Table>
		<Table.Header>
			<Table.Row>
				<Table.HeaderCell width={4}>Event Name</Table.HeaderCell>
				<Table.HeaderCell>Meta</Table.HeaderCell>
				<Table.HeaderCell style={{ marginLeft: 'auto' }} width={3}>Actions</Table.HeaderCell>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{events.map(eventId => <TournamentEventRow event={eventList[eventId]} key={eventId} />)}
		</Table.Body>
	</Table>
)

TeamTable.propTypes = {
	events: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
	})).isRequired,
	eventList: PropTypes.objectOf(PropTypes.object).isRequired,
}

const mapStateToProps = state => ({
	eventList: state.events.eventList,
})

export default connect(mapStateToProps, null)(TeamTable)
