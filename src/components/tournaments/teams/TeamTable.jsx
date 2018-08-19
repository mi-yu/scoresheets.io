import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import TeamRow from './TeamRow'

class TeamTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			sortBy: 'teamNumber',
			sortDir: 'ascending',
			teams: props.teams,
		}
	}

	handleSort = (clickedCol) => () => {
		const { teams, sortBy, sortDir } = this.state
		let sortedTeams

		if (sortBy !== clickedCol) {
			if (clickedCol === 'school') {
				sortedTeams = teams.sort((a, b) => a[clickedCol].localeCompare(b[clickedCol]))
			} else {
				sortedTeams = teams.sort((a, b) => a[clickedCol] - b[clickedCol])
			}
		} else {
			sortedTeams = teams.reverse()
		}

		this.setState({
			teams: sortedTeams,
			sortBy: clickedCol,
			sortDir: sortDir === 'ascending' ? 'descending' : 'ascending',
		})
	}

	render() {
		const { teams, sortBy, sortDir } = this.state
		return (
			<Table sortable>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell
							width={2}
							sorted={sortBy === 'teamNumber' ? sortDir : null}
							onClick={this.handleSort('teamNumber')}
						>
							Team Number
						</Table.HeaderCell>
						<Table.HeaderCell
							sorted={sortBy === 'school' ? sortDir : null}
							onClick={this.handleSort('school')}
						>
							School
						</Table.HeaderCell>
						<Table.HeaderCell style={{ marginLeft: 'auto' }} width={3}>Actions</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{teams.map(team => <TeamRow team={team} key={team._id} />)}
				</Table.Body>
			</Table>
		)
	}
}

TeamTable.propTypes = {
	teams: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
	})).isRequired,
}

export default TeamTable
