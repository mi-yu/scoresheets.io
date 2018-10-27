import React from 'react'
import PropTypes from 'prop-types'
import createTheme from 'spectacle/lib/themes/default'
import { Deck, Heading, Slide, Text, Appear } from 'spectacle'
import qs from 'qs'
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
		primary: 'Lato',
		secondary: {
			name: 'Lato',
			googleFont: true,
			styles: ['400'],
		},
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
			sweepstakesBySchool: qs.parse(props.location.search).sweepstakesBySchool === 'true',
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
		const requests = urls.map(url => request(url, {
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
					!score.rank
					|| score.dq
					|| score.participationOnly
					|| score.noShow
					|| score.dropped
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

		const filteredEntries = sortedEntries.filter(entry => entry.scores.length > 0)

		return filteredEntries
	}

	getSweepstakesTeams = teams => {
		const { numAwards, sweepstakesBySchool } = this.state

		const sortByRank = (t1, t2) => t1.rank - t2.rank

		if (sweepstakesBySchool) {
			const cTeams = teams.filter(team => team.division === 'C').sort(sortByRank)
			const bTeams = teams.filter(team => team.division === 'B').sort(sortByRank)
			const reassignRanks = (team, i) => {
				team.rank = i + 1
			}

			const seenC = {}
			let filteredCTeams = cTeams.filter(team => {
				const seen = seenC[team.school.substring(0, team.school.length - 2)]
				seenC[team.school.substring(0, team.school.length - 2)] = true
				return !seen
			})

			filteredCTeams.forEach(reassignRanks)

			const seenB = {}
			let filteredBTeams = bTeams.filter(team => {
				const seen = seenB[team.school.substring(0, team.school.length - 2)]
				seenB[team.school.substring(0, team.school.length - 2)] = true
				return !seen
			})

			filteredBTeams.forEach(reassignRanks)

			filteredBTeams = filteredBTeams.splice(0, Math.min(filteredBTeams.length, numAwards)).reverse()
			filteredCTeams = filteredCTeams.splice(0, Math.min(filteredCTeams.length, numAwards)).reverse()

			return filteredBTeams.concat(filteredCTeams)
		}

		return teams
			.sort(sortByRank)
			.splice(0, Math.min(teams.length, numAwards * 2))
			.reverse()
			.sort((t1, t2) => t1.division.localeCompare(t2.division))
	}

	renderSweepstakesTeam = team => {
		const { sweepstakesBySchool } = this.state

		if (sweepstakesBySchool) {
			return (
				<Text textAlign="center" textSize="64px">
					{team.school}
				</Text>
			)
		}

		return (
			<Text textAlign="center" textSize="64px">
				{team.division}
				{team.teamNumber} ({team.displayName})
			</Text>
		)
	}

	render() {
		const { topTeamsPerEvent, sweepstakes, tournament } = this.state
		if (!topTeamsPerEvent) return null
		return (
			<Deck id="slideshow" theme={theme} progress="none" controls={false}>
				<Slide transition={['fade']}>
					<Heading size={1}>{tournament.name} Awards</Heading>
					<Heading size={4}>{new Date(tournament.date).toLocaleDateString()}</Heading>
				</Slide>
				{topTeamsPerEvent.map(entry => (
					<Slide transition={['fade']}>
						<Heading size={4} padding="50px">
							{entry.event.name} {entry.division}
						</Heading>
						{entry.scores.map((score, n) => (
							<Appear order={entry.scores.length - n - 1}>
								<Text textAlign="center">
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
							{this.renderSweepstakesTeam(team)}
						</Appear>
					</Slide>
				))}
				<Slide>
					<Heading size={3} padding="50px">
						Thanks for coming!
					</Heading>
				</Slide>
			</Deck>
		)
	}
}

Slideshow.propTypes = {
	location: PropTypes.shape({
		search: PropTypes.string,
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
