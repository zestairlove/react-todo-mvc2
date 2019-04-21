import React, { Component } from 'react';
import classNames from 'classnames/bind';

import styles from './TodoList.module.scss';
import TodoItem from '../TodoItem';

const cx = classNames.bind(styles);

class TodoList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const isTodosChange = this.props.todos !== nextProps.todos;
    const isEditingIdChange = this.props.editingId !== nextProps.editingId;
    return isTodosChange || isEditingIdChange;
  }

  render() {
    const {
      todos,
      editingId,
      onRemove,
      onToggle,
      onEditStart,
      onEditSave,
      onEditCancel
    } = this.props;

    const todoItems = todos.map(todo => (
      <TodoItem
        key={todo.id}
        isDone={todo.isDone}
        isEditing={todo.id === editingId}
        onRemove={() => onRemove(todo.id)}
        onToggle={() => onToggle(todo.id)}
        onEditStart={() => onEditStart(todo.id)}
        onEditSave={text => onEditSave(todo.id, text)}
        onEditCancel={onEditCancel}
      >
        {todo.text}
      </TodoItem>
    ));

    return (
      <div className={cx('todo__list-wrap')}>
        <ul className={cx('todo__list')}>{todoItems}</ul>
      </div>
    );
  }
}

export default TodoList;
