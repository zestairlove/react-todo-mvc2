import React from 'react';
import styles from './PageTemplate.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const PageTemplate = ({ children }) => {
  return (
    <div className={cx('page-template')}>
      <div className={cx('content')}>{children}</div>
    </div>
  );
};

export default PageTemplate;
