import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import AppContainer from './containers/AppContainer';

const Root = () => {
  /**
   * BrowerRouter는 HTML5의 history API를 사용하여
   * 새로고침 하지 않고도 페이지 주소를 교체할 수 있게 한다.
   */
  return (
    <BrowserRouter>
      <Route exact path="/" component={AppContainer} />
      <Route path="/:filterName" component={AppContainer} />
    </BrowserRouter>
  );
};

export default Root;
