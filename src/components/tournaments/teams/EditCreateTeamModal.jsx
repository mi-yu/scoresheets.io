import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Auth from '../../../modules/Auth'
import { API_ROOT } from '../../../config'
import request from '../../../modules/request'
import { setMessage } from '../../../actions/messageActions'
import { updateTeam, addTeam } from '../../../actions/tournamentActions'
import { hideEditCreateModal } from '../../../actions/teamActions'

class EditCreateTeamModal extends React.Component {
	state = {
		currentTeam: {},
	}

	handleChange = (e, { name, value }) => {
		this.setState({
			currentTeam: {
				...this.state.currentTeam,
				[name]: value,
			},
		})
	}

	handleSubmitEvent = () => {
		const { setMessage, addTeam, updateTeam, editing, currentTournament, hideEditCreateModal } = this.props
		const { currentTeam } = this.state
		const tournamentId = currentTournament._id
		const teamId = currentTeam._id

		const url = editing
			? `${API_ROOT}/tournaments/${tournamentId}/teams/${teamId}`
			: `${API_ROOT}/tournaments/${tournamentId}/teams`
		const method = editing ? 'PATCH' : 'POST'

		const token = Auth.getToken()

		request(url, {
			method,
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			}),
			body: JSON.stringify({
				...currentTeam,
				tournament: tournamentId,
			}),
		})
			.then(res => {
				const { division, teamNumber } = currentTeam
				const message = editing ? `Successfully updated team ${division}${teamNumber}.` : `Succesfully created team ${division}${teamNumber}`
				hideEditCreateModal()
				setMessage(message, 'success')
				if (editing) updateTeam(res)
				else addTeam(res[0])
			})
			.catch(err => {
				hideEditCreateModal()
				if (err.name === 'BulkWriteError') {
					setMessage('There was a problem with team creation:', 'error', this.translateBulkWriteError(err.errors))
				} else {
					setMessage(err.message, 'error')
				}
			})
	}

	translateBulkWriteError = (errs) => errs.map(err => `Team ${err.op.division}${err.op.teamNumber} already exists\n`)

	render() {
		const { open, editing, hideEditCreateModal, currentTournament, currentTeamId } = this.props
		const currentTeam = currentTournament.teams.find(team => team._id === currentTeamId) || {}

		return (
			<Modal
				closeIcon
				open={open}
				onClose={hideEditCreateModal}
			>
				<Modal.Header>
					{editing ? `Edit Team: ${currentTeam.school}` : 'New Team'}
				</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Field required>
							<label htmlFor="school">School</label>
							<Form.Input
								required
								name="school"
								value={currentTeam.school}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field>
							<label htmlFor="identifier">Identifier (optional)</label>
							<small>
								{'Use this to distinguish between two teams from the same school (team A/B/C, team Red/Green, etc)'}
							</small>
							<Form.Input
								required
								name="identifier"
								value={currentTeam.identifier}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label htmlFor="division">Division</label>
							<Form.Select
								fluid
								name="division"
								options={[{ text: 'B', value: 'B' }, { text: 'C', value: 'C' }]}
								value={currentTeam.division}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field required>
							<label htmlFor="team number">Team Number</label>
							<Form.Input
								name="teamNumber"
								type="number"
								value={currentTeam.teamNumber}
								onChange={this.handleChange}
							/>
						</Form.Field>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={hideEditCreateModal}>Cancel</Button>
					<Button color="green" onClick={this.handleSubmitEvent}>
						Submit
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	currentTeamId: state.teams.currentTeamId,
	currentTournament: state.tournaments.currentTournament,
	editing: state.teams.editing,
	open: state.teams.editCreateModalOpen,
})

const mapDispatchToProps = dispatch => ({
	setMessage: (message, type, details) => dispatch(setMessage(message, type, details)),
	updateTeam: (updatedTeam) => dispatch(updateTeam(updatedTeam)),
	addTeam: (addedTeam) => dispatch(addTeam(addedTeam)),
	hideEditCreateModal: () => dispatch(hideEditCreateModal()),
})

EditCreateTeamModal.propTypes = {
	currentTeamId: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCreateTeamModal)
