import LoginPage from './containers/LoginPage'
import ProfilePage from './containers/ProfilePage'
import DashboardPage from './containers/DashboardPage'
import TournamentManagementPage from './containers/TournamentManagementPage'
import BulkAddTeamsPage from './containers/BulkAddTeamsPage'
import ScoreEntryPage from './containers/ScoreEntryPage'
import ResultsPage from './containers/ResultsPage'
import Slideshow from './containers/Slideshow'
import RegisterPage from './containers/RegisterPage'
import TeamsPage from './containers/tournaments/TeamsPage'
import EventsPage from './containers/tournaments/EventsPage'

const routes = [
	{
		path: '/users/login',
		component: LoginPage,
	},

	{
		path: '/users/register',
		component: RegisterPage,
	},

	{
		path: '/profile',
		component: ProfilePage,
	},

	{
		path: '/dashboard',
		component: DashboardPage,
	},

	{
		path: '/tournaments/:id',
		component: TournamentManagementPage,
	},

	{
		path: '/tournaments/:tournamentId/teams',
		component: TeamsPage,
	},

	{
		path: '/tournaments/:tournamentId/events',
		component: EventsPage,
	},

	{
		path: '/tournaments/:tournamentId/teams/add',
		component: BulkAddTeamsPage,
	},

	{
		path: '/tournaments/:tournamentId/:division/results',
		component: ResultsPage,
	},

	{
		path: '/tournaments/:id/slideshow',
		component: Slideshow,
	},

	{
		path: '/tournaments/:tournamentId/events/:division/:eventId',
		component: ScoreEntryPage,
	},
]

export default routes
