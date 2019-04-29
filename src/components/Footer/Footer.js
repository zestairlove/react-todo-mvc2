import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

class Footer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const isActiveLengthChange = this.props.activeLength !== nextProps.activeLength;
    const isClearCompletedShowChange = this.props.shouldClearCompletedShow !== nextProps.shouldClearCompletedShow;
    const isSelectedFilterChange = this.props.selectedFilter !== nextProps.selectedFilter;

    return isActiveLengthChange || isClearCompletedShowChange || isSelectedFilterChange;
  }

  render() {
    const {
      selectedFilter,
      activeLength,
      shouldClearCompletedShow,
      onFilterChange,
      onClearCompleted
    } = this.props;

    const filterNames = ['', 'active', 'completed'];
    const filterItems = filterNames.map(filterName => (
      <li
        key={`filter_${filterName}`}
        className={cx({ 'is-selected': selectedFilter === filterName })}
      >
        <Link to={`/${filterName}`} onClick={() => onFilterChange(filterName)}>
          {filterName ? filterName.replace(/^\w/, v => v.toUpperCase()) : 'All'}
        </Link>
      </li>
    ));

    return (
      <footer>
        <span className={cx('todo-count')}>
          <strong>{activeLength}</strong> item{activeLength === 1 ? '' : 's'}{' '}
          left
        </span>
        <ul className={cx('todo-filters')}>{filterItems}</ul>
        <button
          className={cx('todo-clear', {
            'is-show': shouldClearCompletedShow
          })}
          onClick={onClearCompleted}
        >
          Clear Component
        </button>
      </footer>
    );
  }
}

export default Footer;
