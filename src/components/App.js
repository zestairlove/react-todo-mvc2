import React, { Component } from 'react';

import * as api from '../lib/api';
import PageTemplate from './PageTemplate';
import Header from './Header';
import TodoList from './TodoList';
import Footer from './Footer';

class App extends Component {
  state = {
    input: '',
    todos: [],
    editingId: null
  };

  componentDidMount() {
    this.initTodos();
  }

  initTodos() {
    console.log('fetch todo start');
    api.fetchTodos().then(res => {
      const { data } = res;
      const initialTodos = Object.keys(data).reduce((acc, key) => {
        acc.push({ id: key, text: data[key].text, isDone: data[key].isDone });
        return acc;
      }, []);

      this.setState({
        todos: initialTodos
      });
      console.log('fetch todo complete');
    })
    .catch(err => {
      console.log('fetch todo fail');
      throw err;
    });
  }

  handleChange = e => {
    const { value } = e.target;

    this.setState({
      input: value
    });
  };

  handleInsert = () => {
    const { input, todos } = this.state;
    const tempId = 'temp_' + Date.now();
    const tempTodo = { id: tempId, text: input, isDone: false };

    this.setState((state, props) => ({
      input: '',
      todos: [...todos, tempTodo]
    }));

    console.log('insertTodo start');
    api.insertTodo(input)
      .then(res => {
        console.log('insertTodo complete');
        // console.log('this.state.todos', this.state.todos);
        // console.log('todos', todos);
        this.setState((state, props) => ({
          todos: [...todos, { id: res.data.name, text: input, isDone: false }]
        }));
      })
      .catch(err => {
        console.log('insertTodo fail');
        this.setState((state, props) => ({
          todos
        }));

        throw err;
      })
  };

  handleRemove = id => {
    const { todos } = this.state;
    const idx = todos.findIndex(todo => todo.id === id);
    const nextTodos = [...todos.slice(0, idx), ...todos.slice(idx + 1)];

    this.setState((state, props) => ({
      todos: nextTodos
    }));

    console.log('removeTodo start');
    api.removeTodo(id)
      .then(res => {
        console.log('removeTodo complete');
      })
      .catch(err => {
        console.log('removeTodo fail');
        this.setState((state, props) => ({
          todos
        }));
        throw err;
      })

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

  handleEditStart = id => {
    this.setState({
      editingId: id
    });
  };

  handleEditSave = (id, text) => {
    const { todos } = this.state;
    const idx = todos.findIndex(todo => todo.id === id);
    const nextTodos = [
      ...todos.slice(0, idx),
      { ...todos[idx], text },
      ...todos.slice(idx + 1)
    ];

    this.setState({
      todos: nextTodos,
      editingId: null
    });
  };

  handleEditCancel = () => {
    this.setState({
      editingId: null
    });
  };

  handleFilterChange = filterName => {
    this.setState({
      filterName
    });
  };

  handleClearCompleted = () => {
    const { todos } = this.state;
    const nextTodos = todos.filter(todo => !todo.isDone);

    this.setState({
      todos: nextTodos
    });
  };

  render() {
    const { input, todos, editingId } = this.state;
    const {
      handleChange,
      handleInsert,
      handleRemove,
      handleToggle,
      handleToggleAll,
      handleEditStart,
      handleEditSave,
      handleEditCancel,
      handleFilterChange,
      handleClearCompleted
    } = this;
    const { match: { params } } = this.props;
    const filterName = params && (params.filterName || '');

    const isAllDone = todos.every(todo => todo.isDone);

    let filteredTodos;
    switch (filterName) {
      case 'active':
        filteredTodos = todos.filter(todo => !todo.isDone);
        break;
      case 'completed':
        filteredTodos = todos.filter(todo => todo.isDone);
        break;
      case '':
      default:
        filteredTodos = todos;
    }
    const completedLength = todos.filter(todo => todo.isDone).length;
    const shouldClearCompletedShow = completedLength > 0;
    const activeLength = todos.length - completedLength;

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
          todos={filteredTodos}
          editingId={editingId}
          onRemove={handleRemove}
          onToggle={handleToggle}
          onEditStart={handleEditStart}
          onEditSave={handleEditSave}
          onEditCancel={handleEditCancel}
        />
        <Footer
          selectedFilter={filterName}
          activeLength={activeLength}
          shouldClearCompletedShow={shouldClearCompletedShow}
          onFilterChange={handleFilterChange}
          onClearCompleted={handleClearCompleted}
        />
      </PageTemplate>
    );
  }
}

export default App;
