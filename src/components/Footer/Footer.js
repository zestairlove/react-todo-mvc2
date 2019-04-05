import React, { Component } from 'react';
import classNames from 'classnames/bind';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

class Footer extends Component {
  render() {
    return (
      <footer>
        <span className={cx('todo-count')}>
          <strong>3</strong> items left
        </span>
        <ul className={cx('todo-filters')}>
          <li className={cx('is-selected')}>
            <a href="#none">All</a>
          </li>
          <li>
            <a href="#none">Active</a>
          </li>
          <li>
            <a href="#none">Completed</a>
          </li>
        </ul>
        <button className={cx('todo-clear')}>Clear Component</button>
      </footer>
    );
  }
}

export default Footer;
