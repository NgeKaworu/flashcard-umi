import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useHistory } from 'react-router';
import { useQuery, useQueryClient, useMutation } from 'react-query';

import {
  Empty,
  Input,
  Layout,
  Button,
  Menu,
  Space,
  Modal,
  Form,
  Radio,
  Card,
  Skeleton,
} from 'antd';

const { Header, Content, Footer } = Layout;

import styled from 'styled-components';

import { RESTful } from '@/http';
import { mainHost } from '@/http/host';

import { Record } from '@/models/record';
import moment from 'moment';

const RecordHeader = styled(Header)`
  background: white;
  box-shadow: 0px 1px 20px 5px rgb(0 0 0 / 5%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  overflow-x: auto;
`;

const RecordFooter = styled(Footer)`
  background: white;
  display: flex;
  justify-content: space-between;
  width: 100vw;
  overflow-x: auto;
  padding: 12px 8px;
`;

const CenterEmpty = styled(Empty)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

type ReviewType = 'normal' | 'success' | 'fail';
export default () => {
  const [flag, setFlag] = useState<ReviewType>('normal');
  const [curIdx, setCurIdx] = useState<number>(0);
  const queryClient = useQueryClient();

  const { data } = useQuery('review-list', () => {
    return RESTful.get(`${mainHost()}/record/list`, {
      silence: 'success',
      params: {
        isReview: true,
        skip: 0,
        limit: 0,
      },
    });
  });

  const curRencord: Record = data?.data?.[curIdx];
  console.log(curRencord);

  const { isLoading, mutate } = useMutation(
    (data: { [key: string]: any }) => {
      return RESTful.patch(`${mainHost()}/record/set-review-result`, { data });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('records-list');
        queryClient.invalidateQueries('review-list');
      },
    },
  );

  const total = data?.total || 0;

  function onNext() {
    setCurIdx((i) => (++i === total ? 0 : i));
  }

  function onRemember() {
    const id = curRencord?._id;
    const now = moment();
    const cooldownAt = moment(curRencord?.cooldownAt);
    const exp = curRencord?.exp;

    const data: { [key: string]: any } = {
      id,
      cooldownAt,
      exp,
    };

    // 过了冷却才能涨经验
    if (now.isAfter(cooldownAt)) {
      switch (exp) {
        case 0:
          data.cooldownAt = now.add(1, 'hour');
          data.exp = exp + 25;
        case 25:
          data.cooldownAt = now.add(1, 'day');
          data.exp = exp + 25;
        case 50:
          data.cooldownAt = now.add(1, 'week');
          data.exp = exp + 25;
        case 75:
          data.cooldownAt = now.add(1, 'month');
          data.exp = exp + 25;
        case 100:
          data.cooldownAt = now.add(1, 'hours');
        default:
          console.error('invalidate exp type: ', exp);
          break;
      }
    }
    mutate(data);
  }

  function onForget() {
    const id = curRencord?._id;
    const now = moment();
    let exp = curRencord?.exp;
    // 经验降一级
    if (exp !== 0) {
      exp -= 25;
    }

    const data: { [key: string]: any } = {
      id,
      //   冷却一小时
      cooldownAt: now.add(1, 'hour'),
      exp,
    };

    mutate(data);
  }

  function renderTitle() {
    switch (flag) {
      case 'normal':
        return '复习';
      case 'success':
        return <span style={{ color: 'lightgreen' }}>记忆成功</span>;
      case 'fail':
        return <span style={{ color: 'red' }}>记忆失败</span>;
      default:
        console.error('invalidate type: ', flag);
    }
  }

  function renderNextBtn() {
    const hasNext = curIdx < total - 1;
    switch (flag) {
      case 'normal':
        return (
          <Button type="primary" disabled={total <= 1} onClick={onNext}>
            跳过当前
          </Button>
        );
      case 'success':
        return (
          <Button type="primary" onClick={onRemember} loading={isLoading}>
            记忆成功，{hasNext ? '下一项' : '完成复习'}
          </Button>
        );
      case 'fail':
        return (
          <Button type="primary" onClick={onForget} loading={isLoading}>
            记忆失败,{hasNext ? '下一项' : '完成复习'}
          </Button>
        );
      default:
        console.error('invalidate type: ', flag);
    }
  }

  return (
    <Layout style={{ height: '100%' }}>
      <RecordHeader>{renderTitle()}</RecordHeader>
      <Content>
        <CenterEmpty />
      </Content>
      <RecordFooter>
        <Space style={{ marginRight: '12px' }}>还剩{total}个条目在队列中</Space>
        <Space>
          {renderNextBtn()}
          <Button type="primary" disabled={flag !== 'normal'}>
            提交
          </Button>
        </Space>
      </RecordFooter>
    </Layout>
  );
};
