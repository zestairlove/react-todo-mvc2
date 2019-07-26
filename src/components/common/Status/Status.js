import React from 'react';
import classNames from 'classnames/bind';

import styles from './Status.module.scss';

const cx = classNames.bind(styles);

const Status = ({ pending, error}) => {
  return (
    <div className={cx('status', { pending, error})}>
      <div className={cx('status__loader')} />
      <div className={cx('status__error')} />
    </div>
  );
};

export default Status;