import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Icon, Table, Header } from 'semantic-ui-react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Auth from '../modules/Auth'
import { API_ROOT } from '../config'
import request from '../modules/request'
import { setMessage } from '../actions/messageActions'

const divisionOptions = [
	{
		text: 'B',
		value: 'B',
	},
	{
		text: 'C',
		value: 'C',
	},
]

class BulkAddTeamsPage extends React.Component {
	constructor(props) {
		super(props)
		const formData = []
		for (let i = 0; i < 10; i += 1) {
			formData.push({
				teamNumber: undefined,
				tournament: props.match.params.id,
				school: '',
				identifier: '',
				division: '',
			})
		}
		this.state = {
			redirectToManagePage: false,
			options: divisionOptions,
			formData,
		}
	}

	componentDidMount() {
		const { setMessage } = this.props
		const token = Auth.getToken()
		const url = `${API_ROOT}/tournaments/${this.props.match.params.id}`

		request(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(tournament => {
				this.setState({
					tournament,
				})
			})
			.catch(err => {
				setMessage(err.message, 'error')
			})
	}

	handleAddRows = n => {
		const newRows = []
		for (let i = 0; i < n; i += 1) {
			newRows.push({
				teamNumber: undefined,
				tournament: this.props.match.params.id,
				school: '',
				identifier: '',
				division: '',
			})
		}

		this.setState({
			formData: this.state.formData.concat(newRows),
		})
	}

	handleChange = (e, { row, name, value }) => {
		const { formData } = this.state
		let changedRow = formData[row]
		changedRow = {
			...changedRow,
			[name]: value,
		}
		formData[row] = changedRow
		this.setState({
			formData,
		})
	}

	handleAddition = (e, { value }) => {
		this.setState({
			options: [{ text: value, value }, ...this.state.options],
		})
	}

	validateRow = row => row.teamNumber !== 0 && row.school !== '' && row.division !== ''

	isEmpty = row => row.teamNumber !== 0 || row.school !== '' || row.division !== ''

	handleSubmit = () => {
		const { setMessage } = this.props
		const { tournament, formData } = this.state
		const url = `${API_ROOT}/tournaments/${tournament._id}/teams`
		const token = Auth.getToken()

		try {
			formData.forEach(row => {
				if (!this.validateRow(row) && !this.isEmpty(row)) throw new Error()
			})
		} catch (e) {
			return setMessage(
				'There are problems with the form, please make sure every team has a division, team number, and school.',
			)
		}

		const filteredRows = formData.filter(row => this.validateRow(row))

		request(url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			}),
			body: JSON.stringify(filteredRows),
		})
			.then(() => {
				setMessage(`Successfully created ${filteredRows.length} teams`, 'success')
				this.setState({
					redirectToManagePage: true,
				})
			})
			.catch(err => {
				if (err.name === 'BulkWriteError') {
					setMessage('There were the following problems with team creation:', 'error', this.translateBulkWriteError(err.errors))
				} else {
					setMessage(err.message, 'error')
				}
			})

		// TODO: better error handling
	}

	translateBulkWriteError = (errs) => errs.map(err => `Team ${err.op.division}${err.op.teamNumber} already exists\n`)


	render() {
		const { tournament, formData, redirectToManagePage } = this.state
		if (!tournament) return null
		if (redirectToManagePage) return <Redirect to={`/tournaments/${tournament._id}/manage`} />

		return (
			<div>
				<Header as="h1">Bulk Add Teams</Header>
				<Header color="blue">
					<Link to={`/tournaments/${tournament._id}/manage`}>
						<Icon name="long arrow left" />
						{tournament.name}
					</Link>
				</Header>
				<Form>
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell width={3}>Division</Table.HeaderCell>
								<Table.HeaderCell width={2}>Team Number</Table.HeaderCell>
								<Table.HeaderCell width={8}>School</Table.HeaderCell>
								<Table.HeaderCell width={3}>Identifier</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{formData.map((r, i) => (
								<Table.Row key={i}>
									<Table.Cell>
										<Form.Dropdown
											name="division"
											row={i}
											placeholder="Choose division"
											fluid
											selection
											options={divisionOptions}
											value={formData[i].division}
											onChange={this.handleChange}
										/>
									</Table.Cell>
									<Table.Cell>
										<Form.Input
											name="teamNumber"
											row={i}
											fluid
											type="number"
											value={formData[i].teamNumber}
											onChange={this.handleChange}
										/>
									</Table.Cell>
									<Table.Cell>
										<Form.Input
											required
											row={i}
											name="school"
											value={formData[i].school}
											onChange={this.handleChange}
										/>
									</Table.Cell>
									<Table.Cell>
										<Form.Input
											name="identifier"
											row={i}
											fluid
											value={formData[i].identifier}
											onChange={this.handleChange}
										/>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</Form>
				<Button
					icon
					primary
					onClick={() => this.handleAddRows(1)}
					className="padded-button"
				>
					<Icon name="plus" />
					Add 1 More
				</Button>
				<Button
					icon
					primary
					onClick={() => this.handleAddRows(10)}
					className="padded-button"
				>
					<Icon name="plus" />
					Add 10 More
				</Button>
				<Button color="green" className="padded-button" onClick={this.handleSubmit}>
					Submit
				</Button>
			</div>
		)
	}
}

BulkAddTeamsPage.propTypes = {
	setMessage: PropTypes.func.isRequired,
	location: PropTypes.shape({
		state: PropTypes.object.isRequired,
	}),
}

BulkAddTeamsPage.defaultProps = {
	location: undefined,
}

const mapDispatchToProps = dispatch => ({
	setMessage: (message, type, details) => dispatch(setMessage(message, type, details)),
})

export default connect(
	null,
	mapDispatchToProps,
)(BulkAddTeamsPage)
