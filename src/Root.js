import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './containers/App';

const Root = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={App} />
      <Route path="/:filterName" component={App} />
    </BrowserRouter>
  );
};

export default Root;
