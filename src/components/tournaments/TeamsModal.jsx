import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import OpenModalButton from '../modals/OpenModalButton'
import Auth from '../../modules/Auth'
import { API_ROOT } from '../../config'
import request from '../../modules/request'
import { setMessage, showMessage } from '../../actions/messageActions';

class TeamsModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...props,
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.modalOpen !== nextProps.modalOpen) {
			this.setState({
				...nextProps,
				currentTeam: nextProps.currentTeam || {},
			})
		}
	}

	handleChange = (e, { name, value }) => {
		this.setState({
			...this.state,
			currentTeam: {
				...this.state.currentTeam,
				[name]: value,
			},
		})
	}

	handleSubmitEvent = () => {
		const { setMessage, showMessage } = this.props
		const { editing, currentTeam, updateTeam, addTeams, tournament, closeModal } = this.state
		const tournamentId = tournament._id
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
				setMessage(message, 'success')
				showMessage()
				if (editing) updateTeam(res)
				else addTeams(res)
				closeModal()
			})
			.catch(err => {
				closeModal()
				if (err.name === 'BulkWriteError') {
					setMessage('There was a problem with team creation:', 'error', this.translateBulkWriteError(err.errors))
				} else {
					setMessage(err.message, 'error')
				}
			})
	}

	translateBulkWriteError = (errs) => errs.map(err => `Team ${err.op.division}${err.op.teamNumber} already exists\n`)

	render() {
		const { modalOpen, currentTeam, clearCurrentTeam, closeModal, editing } = this.state

		return (
			<Modal
				trigger={
					<OpenModalButton
						onClick={clearCurrentTeam}
						text="New Team"
						icon="plus"
					/>
				}
				closeIcon
				open={modalOpen}
				onClose={closeModal}
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
					<Button onClick={closeModal}>Cancel</Button>
					<Button color="green" onClick={this.handleSubmitEvent}>
						Submit
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	setMessage: (message, type, details) => dispatch(setMessage(message, type, details)),
	showMessage: () => dispatch(showMessage()),
})

TeamsModal.propTypes = {
	modalOpen: PropTypes.bool.isRequired,
	currentTeam: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		division: PropTypes.string.isRequired,
		identifier: PropTypes.string.isRequired,
		teamNumber: PropTypes.number.isRequired,
	}).isRequired,
}

export default connect(null, mapDispatchToProps)(TeamsModal)
