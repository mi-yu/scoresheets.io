import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import Base from './components/Base'
import './styles/style.css'
import store from './store'

// eslint-disable-next-line
ReactDOM.render(
	<Provider store={store}>
		<Base />
	</Provider>,
	document.getElementById('root'),
)

if (module.hot) {
	module.hot.accept()
}
