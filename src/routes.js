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
		path: '/admin/dashboard',
		component: DashboardPage,
	},

	{
		path: '/tournaments/:id',
		component: TournamentManagementPage,
	},

	{
		path: '/tournaments/:id/teams',
		component: TeamsPage,
	},

	{
		path: '/tournaments/:id/teams/add',
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
		path: '/tournaments/:tournamentId/scores/:division/:eventId',
		component: ScoreEntryPage,
	},
]

export default routes
