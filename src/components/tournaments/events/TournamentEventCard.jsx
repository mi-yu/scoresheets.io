import React from 'react'
import PropTypes from 'prop-types'
import { Card, Label, Grid } from 'semantic-ui-react'
import TournamentEventActions from './TournamentEventActions'

const TournamentEventCard = ({
	_id,
	name,
	category,
	stateEvent,
	impound,
	division,
	tournamentId,
}) => {
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
						{division.split('').map(div => <Label key={div} size="tiny">{div}</Label>)}
						{stateEvent && <Label size="tiny">trial</Label>}
						{impound && <Label size="tiny">impound</Label>}
					</Card.Description>
				</Card.Content>
				<Card.Content>
					<TournamentEventActions eventId={_id} division={division} tournamentId={tournamentId} />
				</Card.Content>
			</Card>
		</Grid.Column>
	)
}

TournamentEventCard.propTypes = {
	_id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	category: PropTypes.oneOf(['bio', 'earth', 'inquiry', 'phys/chem', 'building']).isRequired,
	stateEvent: PropTypes.bool.isRequired,
	impound: PropTypes.bool.isRequired,
	division: PropTypes.oneOf(['B', 'C', 'BC']).isRequired,
	tournamentId: PropTypes.string.isRequired,
}

export default TournamentEventCard
