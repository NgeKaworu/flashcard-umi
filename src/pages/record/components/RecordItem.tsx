import React from 'react';

import { Divider, Popconfirm, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import theme from '@/theme';
import type { Record } from '@/models/record';
import styled from 'styled-components';

export interface RecordItemProps {
  onClick: (id: string) => void;
  onRemoveClick: (id: string) => void;
  onEditClick: (record: Record) => void;
  record: Record;
  selected: boolean;
}

interface RecordCardProps {
  percent: number;
  selected: boolean;
}

const RecordCard = styled.div<RecordCardProps>`
  background-color: #fff;
  margin: 12px;
  padding: 12px;
  padding-top: 20px;
  position: relative;
  height: 100%;
  overflow-wrap: break-word;
  /* 进度条 */
  ::before {
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${({ percent }) => percent}%;
    height: 2px;
    background-image: linear-gradient(to right, red, lightgreen);
    content: ' ';
  }
  /* 选中状态 */
  ::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background-color: ${theme['primary-color']};
    visibility: ${({ selected }) => (selected ? 'visible' : 'hidden')};
    content: ' ';
  }

  :hover::after {
    visibility: visible;
  }

  .tools-bar {
    position: absolute;
    top: 0;
    right: 12px;
  }
`;

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
    <RecordCard selected={selected} percent={percent} onClick={clickHandler}>
      <div style={{ whiteSpace: 'pre-wrap' }} onClick={stopPropagation}>
        {source}
      </div>
      <Divider />
      <div style={{ whiteSpace: 'pre-wrap' }} onClick={stopPropagation}>
        {translation}
      </div>
      <div className="tools-bar">
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
    </RecordCard>
  );
};
