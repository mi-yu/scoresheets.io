import React from 'react'
import PropTypes from 'prop-types'
import { Card, Grid } from 'semantic-ui-react'
import TeamActionsButtonGroup from './TeamActionsButtonGroup'

const TeamCard = ({ team }) => (
	<Grid.Column width={4}>
		<Card>
			<Card.Content>
				<Card.Header>{`${team.division}${team.teamNumber}`}</Card.Header>
				<Card.Description>
					{team.displayName}
				</Card.Description>
			</Card.Content>
			<Card.Content>
				<TeamActionsButtonGroup team={team} />
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
}

export default TeamCard
