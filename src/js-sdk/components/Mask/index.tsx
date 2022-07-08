import styles from './index.module.less';

import React from 'react';

export interface MaskProps {
  disabled?: boolean;
  maskProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
  containerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  toolbarProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
}

export default (({ children, maskProps, containerProps, toolbarProps, disabled }) =>
  disabled ? (
    children
  ) : (
    <div {...containerProps} className={styles['mask-container']}>
      {children}
      <span {...maskProps} className={[styles.mask, styles['mask-tool']].join(' ')}>
        <span {...toolbarProps} className={styles['mask-tool-bar']} />
      </span>
    </div>
  )) as React.FC<React.PropsWithChildren<MaskProps>>;
