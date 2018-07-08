import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'

const middleware = applyMiddleware(thunk)

const store = createStore(
	rootReducer,
	compose(
		middleware,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
	),
)

if (module.hot) {
	// Enable Webpack hot module replacement for reducers
	module.hot.accept('./reducers/rootReducer', () => {
		const nextRootReducer = require('./reducers/rootReducer')
		store.replaceReducer(nextRootReducer)
	})
}

export default store
