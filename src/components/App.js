import React, { Component } from 'react';

import PageTemplate from './PageTemplate';
import Header from './Header';
import TodoList from './TodoList';
import Footer from './Footer';

class App extends Component {
  state = {
    input: '',
    todos: [
      { id: 0, text: '리액트 공부하기', isDone: true },
      { id: 1, text: 'ES6 기초', isDone: false },
      { id: 2, text: '컴포넌트 스타일링 하기', isDone: false }
    ],
  }

  render() {
    const { input, todos } = this.state;

    return (
      <PageTemplate>
        <Header value={input} />
        <TodoList todos={todos} />
        <Footer />
      </PageTemplate>
    );
  }
}

export default App;
