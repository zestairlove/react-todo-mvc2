import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import modules from './modules';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// create store
const store = createStore(
  modules,
  composeEnhancers(applyMiddleware(reduxThunk))
);

export default store;