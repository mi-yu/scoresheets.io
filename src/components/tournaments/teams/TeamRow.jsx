import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import TeamActionsButtonGroup from './TeamActionsButtonGroup'

const TeamRow = ({ team }) => (
	<Table.Row>
		<Table.Cell>{`${team.division}${team.teamNumber}`}</Table.Cell>
		<Table.Cell>{team.displayName}</Table.Cell>
		<Table.Cell><TeamActionsButtonGroup team={team} size="mini" /></Table.Cell>
	</Table.Row>
)

TeamRow.propTypes = {
	team: PropTypes.shape({
		division: PropTypes.string.isRequired,
		teamNumber: PropTypes.number.isRequired,
		displayName: PropTypes.string.isRequired,
	}).isRequired,
}

export default TeamRow
