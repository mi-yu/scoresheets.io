import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers/rootReducer'

const middleware = applyMiddleware(thunk)
const composeEnhancers = composeWithDevTools({})

const store = createStore(rootReducer, composeEnhancers(middleware))

if (module.hot) {
	// Enable Webpack hot module replacement for reducers
	module.hot.accept('./reducers/rootReducer', () => {
		const nextRootReducer = require('./reducers/rootReducer')
		store.replaceReducer(nextRootReducer)
	})
}

export default store
