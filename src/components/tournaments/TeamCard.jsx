import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Grid, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import request from '../../modules/request'
import Auth from '../../modules/Auth'
import { API_ROOT } from '../../config'
import { setMessage } from '../../actions/messageActions'

class TeamCard extends React.Component {
	handleDeleteTeam = () => {
		const { setMessage, tournamentId, team, removeTeam } = this.props
		const token = Auth.getToken()
		const url = `${API_ROOT}/tournaments/${tournamentId}/teams/${team._id}`

		request(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(deleted => {
				setMessage(`Successfully deleted team ${deleted.school}`, 'info')
				removeTeam(deleted)
			})
			.catch(err => {
				setMessage(err.message, 'error')
			})
	}

	render() {
		const { team, setCurrentTeam } = this.props
		return (
			<Grid.Column width={4}>
				<Card>
					<Card.Content>
						<Card.Header>{`${team.division}${team.teamNumber}`}</Card.Header>
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
							<Button icon onClick={this.handleDeleteTeam}>
								<Icon name="delete" />
								{'Delete'}
							</Button>
						</Button.Group>
					</Card.Content>
				</Card>
			</Grid.Column>
		)
	}
}

TeamCard.propTypes = {
	team: PropTypes.shape({
		division: PropTypes.string.isRequired,
		identifier: PropTypes.string.isRequired,
		teamNumber: PropTypes.number.isRequired,
	}).isRequired,
	setCurrentTeam: PropTypes.func.isRequired,
	tournamentId: PropTypes.string.isRequired,
}

const mapDispatchToProps = dispatch => ({
	setMessage: (message, type) => dispatch(setMessage(message, type)),
})

export default connect(
	null,
	mapDispatchToProps,
)(TeamCard)
