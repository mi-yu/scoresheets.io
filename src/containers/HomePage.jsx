import React from 'react'
import { Header, List, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const HomePage = () => (
	<div id="home-page">
		<section id="home-hero-wrapper">
			<div id="hero-text">
				<Header as="h1">Tournament scoring, simplified.</Header>
				<p>
					Scoresheets is a management and scoring solution for Science Olympiad tournaments.
					Built by alumni and designed for modern tournament needs.
				</p>
				<p>Scoresheets is free for the 2019 season.</p>
				<Link to="/users/register"><Button size="huge">Get started</Button></Link>
			</div>
			<img src="./imgs/control_panel.svg" alt="control panel" />
		</section>
		<section>
			<div id="home-features-wrapper">
				<div id="features-images">
					<img className="background" src="./imgs/spreadsheet.svg" alt="spreadsheet" />
					<img className="foreground" src="./imgs/calculator.svg" alt="calculation" />
				</div>
				<div id="features-text">
					<Header>Features</Header>
					<List bulleted>
						<List.Item as="p" className="home-feature-list-item">Team management</List.Item>
						<List.Item as="p" className="home-feature-list-item">Automatic score ranking</List.Item>
						<List.Item as="p" className="home-feature-list-item">Single-click awards presentations</List.Item>
					</List>
				</div>
			</div>
		</section>
	</div>
)

export default HomePage
