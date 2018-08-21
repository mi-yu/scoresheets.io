import React from 'react'
import { Header } from 'semantic-ui-react'
import restricted from '../../assets/imgs/restricted.svg'

const wrapperStyle = {
	textAlign: 'center',
	display: 'flex',
	height: '60vh',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
}

const imgStyle = {
	width: '15em',
}

const ResultsUnauthorized = () => (
	<div style={wrapperStyle}>
		<Header as="h3">
			{"Something's"} fishy...
		</Header>
		<p>The results you are trying to access either {"don't"} exist or are not public.</p>
		<p>Contact the tournament director for more information.</p>
		<img src={restricted} alt="results restricted" style={imgStyle} />
	</div>
)

export default ResultsUnauthorized
