import React from 'react'
import { Modal, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Auth from '../../modules/Auth'
import request from '../../modules/request'
import { API_ROOT } from '../../config'
import { setCurrentTournament, removeTeam } from '../../actions/tournamentActions'
import { setMessage } from '../../actions/messageActions'
import { hideConfirmDeleteModal } from '../../actions/teamActions'

class ConfirmDeleteTeamModal extends React.Component {
	handleDeleteTeam = () => {
		const { tournament, currentTeamId, hideConfirmDeleteModal, removeTeam, setMessage } = this.props
		const token = Auth.getToken()
		const url = `${API_ROOT}/tournaments/${tournament._id}/teams/${currentTeamId}`

		request(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(deleted => {
				setMessage(`Successfully deleted team ${deleted.school}`, 'info')
				removeTeam(deleted._id)
				hideConfirmDeleteModal()
			})
			.catch(err => {
				setMessage(err.message, 'error')
			})
	}

	render() {
		const { open, currentTeamId, tournament, hideConfirmDeleteModal } = this.props
		if (!currentTeamId.length) return null

		const team = tournament.teams.find(t => t._id === currentTeamId)
		if (!team) return null

		return (
			<Modal size="tiny" open={open} onClose={hideConfirmDeleteModal}>
				<Modal.Header>Delete Team {team.displayName}</Modal.Header>
				<Modal.Content>
					<p>
						Are you sure you want to delete team
						<strong> {team.displayName}</strong>
						?
					</p>
					<p>This action will delete all associated scores, and cannot be reversed</p>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={hideConfirmDeleteModal}>Cancel</Button>
					<Button negative onClick={this.handleDeleteTeam}>
						Yes, I want to delete {team.displayName}
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}

ConfirmDeleteTeamModal.propTypes = {
	currentTeamId: PropTypes.string.isRequired,
	tournament: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		teams: PropTypes.array.isRequired,
		state: PropTypes.string.isRequired,
		city: PropTypes.string.isRequired,
	}).isRequired,
	open: PropTypes.bool.isRequired,
	hideConfirmDeleteModal: PropTypes.func.isRequired,
	removeTeam: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	tournament: state.tournaments.currentTournament,
	open: state.teams.confirmDeleteModalOpen,
	currentTeamId: state.teams.currentTeamId,
})

const mapDispatchToProps = dispatch => ({
	setCurrentTournament: tournament => dispatch(setCurrentTournament(tournament)),
	setMessage: (message, type) => dispatch(setMessage(message, type)),
	hideConfirmDeleteModal: () => dispatch(hideConfirmDeleteModal()),
	removeTeam: (removedId) => dispatch(removeTeam(removedId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDeleteTeamModal)
