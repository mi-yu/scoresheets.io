import React from 'react'
import PropTypes from 'prop-types'
import createTheme from 'spectacle/lib/themes/default'
import { Deck, Heading, Slide, Text, Appear } from 'spectacle'
import * as qs from 'query-string'
import Auth from '../modules/Auth'
import request from '../modules/request'
import { API_ROOT } from '../config'

const theme = createTheme(
	{
		primary: 'white',
		secondary: '#1F2022',
		tertiary: 'black',
		quarternary: '#CECECE',
	},
	{
		primary: 'Roboto',
	},
)

const getRankSuffix = n => {
	switch (n) {
		case 1:
			return '1st'
		case 2:
			return '2nd'
		case 3:
			return '3rd'
		default:
			return `${n}th`
	}
}

export default class Slideshow extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...props,
			numAwards: qs.parse(props.location.search).numAwards || 4,
		}
	}

	componentDidMount() {
		const { id } = this.props.match.params
		const { setMessage } = this.props
		const token = Auth.getToken()

		const urls = [
			`${API_ROOT}/tournaments/${id}`,
			`${API_ROOT}/tournaments/${id}/scoresheets`,
			`${API_ROOT}/tournaments/${id}/teams`,
		]
		const requests = urls.map(url =>
			request(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		)

		Promise.all(requests)
			.then(([tournament, scoresheets, teams]) => {
				this.setState({
					topTeamsPerEvent: this.getTopTeamsPerEvent(scoresheets),
					tournament,
					sweepstakes: this.getSweepstakesTeams(teams),
				})
			})
			.catch(err => {
				console.log(err)
				setMessage(err.message, 'error')
			})
	}

	getTopTeamsPerEvent = entries => {
		const { numAwards } = this.state
		// We need to count the drops so we can exclude them from the
		// awards presentation.
		let drops = 0
		entries.forEach(entry => {
			entry.scores.forEach(score => {
				if (
					!score.rank ||
					score.dq ||
					score.participationOnly ||
					score.noShow ||
					score.dropped
				) {
					drops += 1
				}
			})

			// Sort the scores, moving the dropped events (zeroes) to end of array.
			entry.scores.sort((a, b) => {
				if (a.rank === 0) return 1
				if (b.rank === 0) return -1
				if (a.rank > b.rank) return 1
				if (a.rank < b.rank) return -1
				return 0
			})

			// Take at most the top n scores, throwing out drops.
			entry.scores = entry.scores.slice(
				0,
				Math.min(numAwards, entry.scores.length - drops, entry.scores.length),
			)

			// Reset drops counter.
			drops = 0
		})

		// Sort entries by event name alphabetically.
		entries.sort((a, b) => a.event.name.localeCompare(b.event.name))

		// Order B events before C events
		const sortedEntries = []

		let b = 0
		let c = 0
		while (sortedEntries.length < entries.length) {
			while (entries[b] && entries[b].division !== 'B') b += 1
			if (b < entries.length) {
				sortedEntries.push(entries[b])
				b += 1
			}

			while (entries[c] && entries[c].division !== 'C') c += 1
			if (c < entries.length) {
				sortedEntries.push(entries[c])
				c += 1
			}
		}

		return sortedEntries
	}

	getSweepstakesTeams = teams => {
		const { numAwards } = this.state
		const sorted = teams.sort((t1, t2) => t1.rank - t2.rank)

		const usedSchools = new Set()
		const finalTeams = []

		sorted.forEach(team => {
			if (!usedSchools.has(team.school)) {
				finalTeams.push(team)
				usedSchools.add(team.school)
			}
		})

		return finalTeams.splice(0, Math.min(finalTeams.length, numAwards))
	}

	render() {
		const { topTeamsPerEvent, sweepstakes, tournament } = this.state
		if (!topTeamsPerEvent) return null
		return (
			<Deck theme={theme} progress="none" controls={false}>
				<Slide transition={['fade']}>
					<Heading size={1}>{tournament.name} Awards</Heading>
					<Heading size={4}>{new Date(tournament.date).toLocaleDateString()}</Heading>
				</Slide>
				{topTeamsPerEvent.map(entry => (
					<Slide transition={['fade']}>
						<Heading size={3} padding="50px">
							{entry.event.name} {entry.division}
						</Heading>
						{entry.scores.map((score, n) => (
							<Appear order={entry.scores.length - n - 1}>
								<Text textAlign="center" textFont="Roboto">
									{n + 1}. {score.team.division}
									{score.team.teamNumber} ({score.team.school}
									{score.team.identifier ? ` ${score.team.identifier}` : ''})
								</Text>
							</Appear>
						))}
					</Slide>
				))}
				{sweepstakes.map(team => (
					<Slide key={team._id}>
						<Heading size={4} padding="50px">
							Sweepstakes {team.division} - {getRankSuffix(team.rank)} Place
						</Heading>
						<Appear>
							<Text textAlign="center" textSize="64px">
								{team.division}
								{team.teamNumber} ({team.school}
								{team.identifier ? ` ${team.identifier}` : ''})
							</Text>
						</Appear>
					</Slide>
				))}
				<Slide>
					<Heading size={3} padding="50px">
						Thanks for coming!
					</Heading>
					<Text textAlign="center">
						Visit scoresheets.io/tournamentName/results for full results.
					</Text>
				</Slide>
			</Deck>
		)
	}
}

Slideshow.propTypes = {
	location: PropTypes.shape({
		state: PropTypes.object.isRequired,
	}),
	match: PropTypes.shape({
		params: PropTypes.object.isRequired,
	}),
	setMessage: PropTypes.func.isRequired,
}

Slideshow.defaultProps = {
	location: undefined,
	match: undefined,
}
