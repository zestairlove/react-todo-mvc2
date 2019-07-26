import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';

import modules from './modules';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const logger = createLogger();

// create store
const store = createStore(
  modules,
  composeEnhancers(applyMiddleware(logger, reduxThunk))
);

export default store;