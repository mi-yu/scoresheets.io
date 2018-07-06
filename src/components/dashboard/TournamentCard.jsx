import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { setCurrentTournament, openTournamentsModal } from '../../actions/tournamentActions'

const TournamentCard = ({ tournament, setCurrentTournament, openTournamentsModal }) => {
	const { _id, name, city, state, date } = tournament
	return (
		<Grid.Column width={4}>
			<Card>
				<Card.Content>
					<Card.Header>{name}</Card.Header>
					<Card.Meta>
						{city}, {state} on {new Date(date).toLocaleDateString()}
					</Card.Meta>
				</Card.Content>
				<Card.Content extra>
					<div className="ui two buttons">
						<Button
							as={Link}
							color="blue"
							to={{
								pathname: `/tournaments/${_id}/manage`,
								state: {
									tournament: {
										_id,
										name,
										city,
										state,
										date,
									},
								},
							}}
						>
							Manage
						</Button>
						<Button
							color="grey"
							onClick={() => {
								setCurrentTournament(tournament)
								openTournamentsModal()
							}}
						>
							Edit Details
						</Button>
					</div>
				</Card.Content>
			</Card>
		</Grid.Column>
	)
}

TournamentCard.propTypes = {
	_id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	city: PropTypes.string.isRequired,
	state: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired,
	setCurrentTournament: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
	setCurrentTournament: tournament => dispatch(setCurrentTournament(tournament)),
	openTournamentsModal: () => dispatch(openTournamentsModal()),
})

export default connect(
	null,
	mapDispatchToProps,
)(TournamentCard)
