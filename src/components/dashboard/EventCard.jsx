import React from 'react'
import PropTypes from 'prop-types'
import { Card, Label, Button, Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setCurrentEvent, openEventsModal, setEditing } from '../../actions/eventActions'

const EventCard = ({ event, setCurrentEvent, openEventsModal, setEditing }) => {
	const { name, category, stateEvent, impound, division } = event
	let color = ''
	switch (category) {
		case 'bio':
			color = 'green'
			break
		case 'earth':
			color = 'brown'
			break
		case 'inquiry':
			color = 'pink'
			break
		case 'phys/chem':
			color = 'violet'
			break
		case 'building':
			color = 'orange'
			break
		default:
			color = 'grey'
			break
	}

	return (
		<Grid.Column width={4}>
			<Card>
				<Card.Content>
					<Card.Header>{name}</Card.Header>
					<Card.Description>
						<Label size="tiny" color={color}>
							{category}
						</Label>
						{division &&
							division.split('').map(div => <Label size="tiny">{div}</Label>)}
						{stateEvent && <Label size="tiny">trial</Label>}
						{impound && <Label size="tiny">impound</Label>}
					</Card.Description>
				</Card.Content>
				<Card.Content>
					<Button
						fluid
						color="blue"
						onClick={() => {
							setCurrentEvent(event)
							setEditing(true)
							openEventsModal()
						}}
					>
						Edit
					</Button>
				</Card.Content>
			</Card>
		</Grid.Column>
	)
}

EventCard.propTypes = {
	event: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		category: PropTypes.oneOf(['bio', 'earth', 'inquiry', 'phys/chem', 'building']).isRequired,
		stateEvent: PropTypes.bool.isRequired,
		impound: PropTypes.bool.isRequired,
		division: PropTypes.oneOf(['B', 'C', 'BC']).isRequired,
	}).isRequired,
	setCurrentEvent: PropTypes.func.isRequired,
	openEventsModal: PropTypes.func.isRequired,
	setEditing: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
	setCurrentEvent: event => dispatch(setCurrentEvent(event)),
	openEventsModal: () => dispatch(openEventsModal()),
	setEditing: editing => dispatch(setEditing(editing)),
})

export default connect(
	null,
	mapDispatchToProps,
)(EventCard)
