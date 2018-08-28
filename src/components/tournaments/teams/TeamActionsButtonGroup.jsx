import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import { showConfirmDeleteModal, setCurrentTeam, setEditingTeam, showEditCreateModal } from '../../../actions/teamActions'

const buttonStyle = {
	display: 'flex',
	alignItems: 'center',
}

const buttonTextStyle = {
	marginLeft: '0.25em',
}

const TeamActionsButtonGroup = ({
	team,
	size,
	showConfirmDeleteModal,
	setEditingTeam,
	setCurrentTeam,
	showEditCreateModal,
}) => (
	<Button.Group basic size={size}>
		{/* <Button icon style={buttonStyle}>
			<Icon name="trophy" size="small" />
			<div style={buttonTextStyle}>Scores</div>
		</Button> */}
		<Button
			icon
			onClick={() => {
				setCurrentTeam(team._id)
				setEditingTeam(true)
				showEditCreateModal()
			}}
			style={buttonStyle}
		>
			<Icon name="edit" size="small" />
			<div style={buttonTextStyle}>Edit</div>
		</Button>
		<Button
			icon
			onClick={() => {
				showConfirmDeleteModal()
				setCurrentTeam(team._id)
			}}
			style={buttonStyle}
		>
			<Icon name="delete" size="small" />
			<div style={buttonTextStyle}>Delete</div>
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
	size: PropTypes.string,
	showConfirmDeleteModal: PropTypes.func.isRequired,
	setEditingTeam: PropTypes.func.isRequired,
	setCurrentTeam: PropTypes.func.isRequired,
	showEditCreateModal: PropTypes.func.isRequired,
}

TeamActionsButtonGroup.defaultProps = {
	size: 'small',
}

export default connect(null, mapDispatchToProps)(TeamActionsButtonGroup)
