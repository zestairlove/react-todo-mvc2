import React, { Component } from 'react';
import axios from 'axios';
import produce from 'immer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as api from '../lib/api';
import * as todosActions from '../modules/todos';

import PageTemplate from '../components/PageTemplate';
import Header from '../components/Header';
import TodoList from '../components/TodoList';
import Footer from '../components/Footer';

class App extends Component {
  componentDidMount() {
    this.props.TodosActions.initTodos();
    //this.initTodos();
  }

  handleChange = e => {
    const { value } = e.target;
    // this.setState({
    //   input: value
    // });
    this.props.TodosActions.changeInput(value);
  };

  handleInsert = () => {
    const { input, todos } = this.state;
    const tempId = 'temp_' + Date.now();
    const tempTodo = { id: tempId, text: input, isDone: false };

    this.setState(produce(draft => {
      draft.input = '';
      draft.todos.push(tempTodo);
    }));

    console.log('insertTodo start');
    api.insertTodo(input)
      .then(res => {
        console.log('insertTodo complete');
        this.setState(produce(draft => {
          draft.todos[draft.todos.length - 1].id = res.data.name;
        }))
      })
      .catch(err => {
        console.log('insertTodo fail');
        this.setState((state, props) => ({
          todos
        }));

        throw err;
      });
  };

  handleRemove = id => {
    const { todos } = this.state;
    const idx = todos.findIndex(todo => todo.id === id);

    this.setState(produce(draft => {
      draft.todos.splice(idx, 1);
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
      });
  };

  handleToggle = id => {
    const { todos } = this.state;
    const idx = todos.findIndex(todo => todo.id === id);
    const nextIsDone = !todos[idx].isDone;

    this.setState(produce(draft => {
      draft.todos[idx].isDone = nextIsDone;
    }));

    console.log('toggleTodo start');
    api.patchTodo(id, { isDone: nextIsDone })
      .then(res => {
        console.log('toggleTodo complete');
      })
      .catch(err => {
        console.log('toggleTodo fail');
        this.setState((state, props) => ({
          todos
        }));
        throw err;
      });
  };

  handleToggleAll = () => {
    const { todos } = this.state;
    const nextIsDone = todos.some(todo => !todo.isDone);

    this.setState(produce(draft => {
      draft.todos.forEach(todo => todo.isDone = nextIsDone)
    }));
    
    const axiArray = todos.map(todo =>
      api.patchTodo(todo.id, { isDone: nextIsDone })
    );
      
    console.log('toggleAll start');
    axios.all(axiArray)
      .then(res => {
        console.log('toggleAll complete');
      })
      .catch(err => {
        console.log('toggleAll fail');
        this.setState((state, props) => ({
          todos
        }));
        throw err;
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

    this.setState(produce(draft => {
      draft.todos[idx].text = text;
      draft.editingId = null;
    }));

    console.log('editSave start');
    api.patchTodo(id, { text })
      .then(res => {
        console.log('editSave complete');
      })
      .catch(err => {
        console.log('editSave fail');
        this.setState((state, props) => ({ todos }));
        throw err;
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

    this.setState(produce(draft => {
      draft.todos = draft.todos.filter(todo => !todo.isDone);
    }));

    const axiArray = todos
      .filter(todo => todo.isDone)
      .map(todo => api.removeTodo(todo.id));
    
    console.log('clearCompleted start');
    axios.all(axiArray)
      .then(res => {
        console.log('clearCompleted complete');
      })
      .catch(err => {
        console.log('clearCompleted fail');
        this.setState((state, props) => ({ todos }));
        throw err;
      });
  };

  render() {
    const { input, todos, editingId } = this.props;
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

export default connect(
  state => ({
    input: state.input,
    todos: state.todos,
    editingId: state.editingId,
    pending: state.pending,
    error: state.error
  }),
  dispatch => ({
    TodosActions: bindActionCreators(todosActions, dispatch)
  })
)(App);
