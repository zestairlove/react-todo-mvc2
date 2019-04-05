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
    ]
  };

  handleChange = e => {
    const { value } = e.target;

    this.setState({
      input: value
    });
  };

  handleInsert = () => {
    const { input, todos } = this.state;
    const tempId = 'temp_' + Date.now();
    const newTodo = { id: tempId, text: input, isDone: false };

    this.setState({
      input: '',
      todos: [...todos, newTodo]
    });
  };

  handleRemove = id => {
    const { todos } = this.state;
    const idx = todos.findIndex(todo => todo.id === id);
    const nextTodos = [...todos.slice(0, idx), ...todos.slice(idx + 1)];

    this.setState({
      todos: nextTodos
    });
  };

  handleToggle = id => {
    const { todos } = this.state;
    const idx = todos.findIndex(todo => todo.id === id);
    const nextTodos = [
      ...todos.slice(0, idx),
      { ...todos[idx], isDone: !todos[idx].isDone },
      ...todos.slice(idx + 1)
    ];

    this.setState({
      todos: nextTodos
    });
  };

  handleToggleAll = () => {
    const { todos } = this.state;
    const nextIsDone = todos.some(todo => !todo.isDone);
    const nextTodos = todos.map(todo => ({ ...todo, isDone: nextIsDone }));
    // const nextTodos = todos.map(todo =>
    //   Object.assign({}, todo, { isDone: nextIsDone })
    // );

    this.setState({
      todos: nextTodos
    });
  };

  render() {
    const { input, todos } = this.state;
    const {
      handleChange,
      handleInsert,
      handleRemove,
      handleToggle,
      handleToggleAll
    } = this;

    const isAllDone = todos.every(todo => todo.isDone);

    return (
      <PageTemplate>
        <Header
          value={input}
          isAllDone={isAllDone}
          onChange={handleChange}
          onInsert={handleInsert}
          onToggleAll={handleToggleAll}
        />
        <TodoList
          todos={todos}
          onRemove={handleRemove}
          onToggle={handleToggle}
        />
        <Footer />
      </PageTemplate>
    );
  }
}

export default App;
