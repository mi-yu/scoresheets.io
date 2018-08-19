import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import { connect } from 'react-redux'
import TournamentEventRow from './TournamentEventRow'

class TournamentEventTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			sortDir: 'ascending',
			sortBy: 'name',
			events: props.events.map(eventId => props.eventList[eventId]),
		}
	}

	handleSort = (clickedCol) => () => {
		const { events, sortBy, sortDir } = this.state
		let sortedEvents
		if (sortBy !== clickedCol) {
			sortedEvents = events.sort((a, b) => a[clickedCol].localeCompare(b[clickedCol]))
		} else {
			sortedEvents = events.reverse()
		}

		this.setState({
			events: sortedEvents,
			sortBy: clickedCol,
			sortDir: sortDir === 'ascending' ? 'descending' : 'ascending',
		})
	}

	render() {
		const { sortDir, sortBy, events } = this.state
		const { events: incomingEvents } = this.props

		// TODO: fix this n^2 hack
		const filteredEvents = events.filter(event => incomingEvents.includes(event._id))

		return (
			<Table sortable>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell
							width={4}
							sorted={sortBy === 'name' ? sortDir : null}
							onClick={this.handleSort('name')}
						>
							Event Name
						</Table.HeaderCell>
						<Table.HeaderCell
							width={4}
							sorted={sortBy === 'category' ? sortDir : null}
							onClick={this.handleSort('category')}
						>
							Category
						</Table.HeaderCell>
						<Table.HeaderCell width={2}>Division(s)</Table.HeaderCell>
						<Table.HeaderCell width={2}>Other</Table.HeaderCell>
						<Table.HeaderCell width={3}>Actions</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{filteredEvents.map(event => <TournamentEventRow event={event} key={event._id} />)}
				</Table.Body>
			</Table>
		)
	}
}

TournamentEventTable.propTypes = {
	events: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
	})).isRequired,
	eventList: PropTypes.objectOf(PropTypes.object).isRequired,
}

const mapStateToProps = state => ({
	eventList: state.events.eventList,
})

export default connect(mapStateToProps, null)(TournamentEventTable)
