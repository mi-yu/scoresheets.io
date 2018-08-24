import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import TeamCard from './TeamCard'

const TeamGrid = ({ tournament, division }) => {
	const { teams } = tournament
	if (!teams || !teams.length) return null

	const filteredTeams = teams.filter(team => team.division === division)

	return (
		<Grid>
			{filteredTeams.map(team => <TeamCard key={team._id} team={team} />)}
		</Grid>
	)
}

TeamGrid.propTypes = {
	tournament: PropTypes.shape({
		teams: PropTypes.arrayOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
		})).isRequired,
	}).isRequired,
	division: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
})

export default connect(mapStateToProps, null)(TeamGrid)
