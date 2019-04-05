import React from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Header = ({ value, onChange, onInsert }) => {
  const handleKeyDown = e => {
    if (e.key === 'Enter' && e.target.value !== '') {
      onInsert()
    }
  }

  return (
    <header>
      <h1 className={cx('todo__title')}>todos</h1>
      <input
        type="text"
        className={cx('todo__new-input')}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <div className={cx('todo__toggle-all')}>
        <input id="toggle-all" type="checkbox" />
        <label htmlFor="toggle-all">
          <span className="sr-only">Toggle All</span>
        </label>
      </div>
    </header>
  );
};

export default Header;
