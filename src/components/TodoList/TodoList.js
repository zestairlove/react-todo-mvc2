import React, { Component } from 'react';
import classNames from 'classnames/bind';

import styles from './TodoList.module.scss';
import TodoItem from '../TodoItem';

const cx = classNames.bind(styles);

class TodoList extends Component {
  render() {
    const { todos, onRemove, onToggle } = this.props;

    const todoItems = todos.map(todo => (
      <TodoItem
        key={todo.id}
        isDone={todo.isDone}
        onRemove={() => onRemove(todo.id)}
        onToggle={() => onToggle(todo.id)}
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
