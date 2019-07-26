import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';
import { createPromise } from 'redux-promise-middleware';

import modules from './modules';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const logger = createLogger();
const pm = createPromise({
  promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'FAILURE']
});

// create store
const store = createStore(
  modules,
  composeEnhancers(applyMiddleware(logger, reduxThunk, pm))
);

export default store;
