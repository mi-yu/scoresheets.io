import React from 'react'
import PropTypes from 'prop-types'
import { Card, Label, Button, Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setCurrentEvent, openEventsModal } from '../../actions/eventActions'

const EventCard = ({ event, setCurrentEvent, openEventsModal }) => {
	const { _id, name, category, stateEvent, impound, division } = event
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
	_id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	category: PropTypes.oneOf(['bio', 'earth', 'inquiry', 'phys/chem', 'building']).isRequired,
	stateEvent: PropTypes.bool.isRequired,
	impound: PropTypes.bool.isRequired,
	division: PropTypes.oneOf(['B', 'C', 'BC']).isRequired,
	setCurrentEvent: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
	setCurrentEvent: event => dispatch(setCurrentEvent(event)),
	openEventsModal: () => dispatch(openEventsModal()),
})

export default connect(
	null,
	mapDispatchToProps,
)(EventCard)
