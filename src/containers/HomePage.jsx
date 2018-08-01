import React from 'react'
import { Header } from 'semantic-ui-react'

const HomePage = () => (
	<div id="home-page">
		<section id="home-hero-wrapper">
			<div id="hero-text">
				<Header as='h1'>Tournament scoring, simplified.</Header>
				<p>
					Scoresheets is a management and scoring solution for Science Olympiad tournaments.
					Built by alumni and designed for modern tournament needs.
				</p>
				<p>Scoresheets is free for the 2019 season.</p>
			</div>
		</section>
		<section>
			<Header>Another header</Header>
			<p>Some dummy content</p>
		</section>
	</div>
)

export default HomePage
