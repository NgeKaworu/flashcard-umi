import React from 'react';

import { Divider, Popconfirm, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import type { Record } from '@/models/record';
import styles from './index.less';

export interface RecordItemProps {
  onClick: (id: string) => void;
  onRemoveClick: (id: string) => void;
  onEditClick: (record: Record) => void;
  record: Record;
  selected: boolean;
}

export default ({
  onClick,
  onRemoveClick,
  onEditClick,
  selected,
  record,
}: RecordItemProps) => {
  const { _id, source, translation, exp: percent } = record;
  function clickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    onClick(_id);
  }
  function editClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    onEditClick(record);
  }
  function removeClickHandler(e?: React.MouseEvent<HTMLElement, MouseEvent>) {
    e?.stopPropagation();
    onRemoveClick(_id);
  }

  function stopPropagation(e?: React.MouseEvent<HTMLElement, MouseEvent>) {
    e?.stopPropagation();
  }

  return (
    <div className={styles['record-card']} onClick={clickHandler}>
      <div className={styles.progress} style={{ width: percent }} />
      <div className={[styles.check, selected && styles.selected].join(' ')} />
      <div style={{ whiteSpace: 'pre-wrap' }} onClick={clickHandler}>
        {source}
      </div>
      <Divider />
      <div style={{ whiteSpace: 'pre-wrap' }} onClick={clickHandler}>
        {translation}
      </div>
      <div className={styles['tools-bar']}>
        <Button
          size="small"
          type="text"
          onClick={editClickHandler}
          icon={<EditOutlined />}
        ></Button>
        <Popconfirm
          title={'操作不可逆，请确认'}
          onConfirm={removeClickHandler}
          onCancel={stopPropagation}
        >
          <Button
            size="small"
            type="text"
            danger
            onClick={stopPropagation}
            icon={<DeleteOutlined />}
          ></Button>
        </Popconfirm>
      </div>
    </div>
  );
};
