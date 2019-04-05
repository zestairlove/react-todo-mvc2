import React, { Component } from 'react';
import classNames from 'classnames/bind';

import styles from './TodoItem.module.scss';

const cx = classNames.bind(styles);

class TodoItem extends Component {
  componentDidUpdate(prevProps) {
    const { isEditing } = this.props;
    if (isEditing && !prevProps.isEditing) this.elInput.focus();
  }

  handleKeyDown = e => {
    const { key, target: { value } } = e;
    const { onEditSave } = this.props;

    if (key === 'Enter' && value !== '') {
      onEditSave(value);
    }
  }

  handleEditCancel = () => {
    const { children, onEditCancel } = this.props;
    this.elInput.value = children;
    onEditCancel();
  }

  render() {
    const {
      children,
      isDone,
      isEditing,
      onRemove,
      onToggle,
      onEditStart
    } = this.props;

    const { handleEditCancel, handleKeyDown } = this;

    return (
      <li className={cx('todo-item', { 'is-editing': isEditing })}>
        <div className={cx('todo-item__view')}>
          <input
            type="checkbox"
            className={cx('todo-item__toggle')}
            checked={isDone}
            readOnly
            onClick={onToggle}
          />
          <label className={cx({ 'is-done': isDone })} onDoubleClick={onEditStart}>{children}</label>
          <button className={cx('todo-item__del')} onClick={onRemove}>
            <span className="sr-only">삭제</span>
          </button>
        </div>
        <input
          type="text"
          className={cx('todo-item__edit')}
          ref={elInput => this.elInput = elInput}
          defaultValue={children}
          onBlur={handleEditCancel}
          onKeyDown={handleKeyDown}
        />
      </li>
    );
  }
}

export default TodoItem;
