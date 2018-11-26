const countOccurrences = (scores, target) => scores.reduce((total, score) => total + Number(score === target), 0)

const breakTie = (t1, t2) => {
	const MAX_PLACES = 10
	let currentPlace = 1
	let tieBroken = false

	let t1Count = 0
	let t2Count = 0

	while (!tieBroken && currentPlace <= MAX_PLACES) {
		t1Count = countOccurrences(t1.scores, currentPlace)
		t2Count = countOccurrences(t2.scores, currentPlace)
		if (t1Count - t2Count !== 0) tieBroken = true
		else currentPlace += 1
	}

	return t2Count - t1Count
}

const populateScores = (entries, teams) => {
	let totalScore = 0
	teams.forEach(team => {
		team.scores = []
		entries.forEach(entry => {
			entry.scores.forEach(score => {
				if (score.team._id === team._id) {
					team.scores.push(score.rank || 0)
					totalScore += score.rank || 0
				}
			})
		})
		team.totalScore = totalScore
		totalScore = 0
	})

	teams.sort((t1, t2) => {
		const scoreDiff = t1.totalScore - t2.totalScore
		if (scoreDiff === 0) return breakTie(t1, t2)
		return scoreDiff
	})

	teams.forEach((team, index) => {
		team.rank = index + 1
	})

	return teams
}

export default populateScores
