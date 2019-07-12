import React, { Component } from 'react';

import PageTemplate from './PageTemplate';
import Header from './Header';
import TodoList from './TodoList';
import Footer from './Footer';

class App extends Component {
  componentDidMount() {
    this.props.TodosActions.initTodos();
  }

  handleChange = e => {
    const { value } = e.target;
    this.props.InputActions.changeInput(value);
  };

  handleInsert = () => {
    this.props.TodosActions.insertTodo();
    this.props.InputActions.clearInput();
  };

  handleRemove = id => this.props.TodosActions.removeTodo(id);

  handleToggle = id => this.props.TodosActions.toggleTodo(id);

  handleToggleAll = () => this.props.TodosActions.toggleAll();

  handleEditStart = id => this.props.TodosActions.editStart(id);

  handleEditSave = (id, text) => this.props.TodosActions.editSave(id, text);

  handleEditCancel = () => this.props.TodosActions.editCancel();

  handleClearCompleted = () => this.props.TodosActions.clearCompleted();

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
          onClearCompleted={handleClearCompleted}
        />
      </PageTemplate>
    );
  }
}

export default App;
