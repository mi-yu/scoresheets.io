import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Grid, Icon } from 'semantic-ui-react'

const TeamCard = ({ team, setCurrentTeam }) => (
	<Grid.Column width={4}>
		<Card>
			<Card.Content>
				<Card.Header>
					{team.division + team.teamNumber}
				</Card.Header>
				<Card.Description>
					{`${team.school} ${team.identifier || ''}`}
				</Card.Description>
			</Card.Content>
			<Card.Content>
				<Button.Group basic>
					<Button icon>
						<Icon name="trophy" />
						{'Scores'}
					</Button>
					<Button icon onClick={() => setCurrentTeam(team._id)}>
						<Icon name="edit" />
						{'Edit'}
					</Button>
					<Button icon>
						<Icon name="delete" />
						{'Delete'}
					</Button>
				</Button.Group>
			</Card.Content>
		</Card>
	</Grid.Column>
)

TeamCard.propTypes = {
	team: PropTypes.shape({
		division: PropTypes.string.isRequired,
		identifier: PropTypes.string.isRequired,
		teamNumber: PropTypes.number.isRequired,
	}).isRequired,
	setCurrentTeam: PropTypes.func.isRequired,
}

export default TeamCard
