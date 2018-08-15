import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import { showConfirmDeleteModal, setCurrentTeam, setEditingTeam, showEditCreateModal } from '../../actions/teamActions'

const TeamActionsButtonGroup = ({ team, showConfirmDeleteModal, setEditingTeam, setCurrentTeam, showEditCreateModal }) => (
	<Button.Group basic>
		<Button icon>
			<Icon name="trophy" />
			Scores
		</Button>
		<Button
			icon
			onClick={() => {
				setCurrentTeam(team._id)
				setEditingTeam(true)
				showEditCreateModal()
			}}
		>
			<Icon name="edit" />
			Edit
		</Button>
		<Button
			icon
			onClick={() => {
				showConfirmDeleteModal()
				setCurrentTeam(team._id)
			}}
		>
			<Icon name="delete" />
			Delete
		</Button>
	</Button.Group>
)

const mapDispatchToProps = dispatch => ({
	showConfirmDeleteModal: () => dispatch(showConfirmDeleteModal()),
	showEditCreateModal: () => dispatch(showEditCreateModal()),
	setCurrentTeam: (teamId) => dispatch(setCurrentTeam(teamId)),
	setEditingTeam: (editing) => dispatch(setEditingTeam(editing)),
})

TeamActionsButtonGroup.propTypes = {
	team: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
}

export default connect(null, mapDispatchToProps)(TeamActionsButtonGroup)
