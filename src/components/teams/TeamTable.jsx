import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import TeamRow from './TeamRow'

const TeamTable = ({ teams }) => (
	<Table>
		<Table.Header>
			<Table.Row>
				<Table.HeaderCell width={2}>Team Number</Table.HeaderCell>
				<Table.HeaderCell width={4}>School</Table.HeaderCell>
				<Table.HeaderCell id="spacer" width={6} />
				<Table.HeaderCell>Actions</Table.HeaderCell>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{teams.map(team => <TeamRow team={team} key={team._id} />)}
		</Table.Body>
	</Table>
)

TeamTable.propTypes = {
	teams: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
	})).isRequired,
}

export default TeamTable
