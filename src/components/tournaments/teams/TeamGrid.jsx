import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'
import TeamCard from './TeamCard'

const TeamGrid = ({ teams }) => (
	<Grid>
		{teams.map(team => <TeamCard key={team._id} team={team} />)}
	</Grid>
)

TeamGrid.propTypes = {
	teams: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
	})).isRequired,
}

export default TeamGrid
