import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';

import {
  Empty,
  Input,
  Layout,
  Button,
  Space,
  Form,
  Skeleton,
  Divider,
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

const FlexForm = styled(Form)`
  display: flex;
  flex-direction: column;
  margin: 12px;
  padding: 12px;
  height: calc(100% - 12px - 12px);
  background-color: white;
  min-height: 720px;
`;

const FlexFormItem = styled(Form.Item)`
  flex: 1;
`;
type ReviewType = 'normal' | 'success' | 'fail';
export default () => {
  const [form] = Form.useForm();
  const [flag, setFlag] = useState<ReviewType>('normal');
  const [curIdx, setCurIdx] = useState<number>(0);
  const queryClient = useQueryClient();

  const { data } = useQuery('review-list', () => {
    return RESTful.get(`${mainHost()}/record/list`, {
      silence: 'success',
      params: {
        inReview: true,
        skip: 0,
        limit: 0,
      },
    });
  });

  const datas = data?.data,
    curRencord: Record = datas?.[curIdx];

  const { isLoading, mutate } = useMutation(
    (data: { [key: string]: any }) => {
      return RESTful.patch(`${mainHost()}/record/set-review-result`, {
        data,
        silence: 'success',
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('records-list');
        queryClient.invalidateQueries('review-list');
        setFlag('normal');
        setCurIdx(0);
        form.resetFields();
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
          <Button disabled={total <= 1} onClick={onNext}>
            跳过当前
          </Button>
        );
      case 'success':
        return (
          <Button
            onClick={onRemember}
            loading={isLoading}
            style={{ background: 'lightgreen' }}
          >
            记忆成功，{hasNext ? '下一项' : '完成复习'}
          </Button>
        );
      case 'fail':
        return (
          <Button type="primary" danger onClick={onForget} loading={isLoading}>
            记忆失败,{hasNext ? '下一项' : '完成复习'}
          </Button>
        );
      default:
        console.error('invalidate type: ', flag);
    }
  }

  function submitHandler() {
    form.validateFields().then((values) => {
      if (values.answer === curRencord.source) {
        setFlag('success');
      } else {
        setFlag('fail');
      }
    });
  }

  return (
    <Layout style={{ height: '100%' }}>
      <RecordHeader>{renderTitle()}</RecordHeader>
      <Content style={{ overflowY: 'auto' }}>
        {datas?.length ? (
          <FlexForm form={form}>
            <FlexFormItem>
              <div>译文： </div>
              {curRencord?.translation}
            </FlexFormItem>
            <Divider />
            <FlexFormItem>
              <div>原文： </div>
              {flag !== 'normal' ? curRencord?.source : <Skeleton />}
            </FlexFormItem>
            <Divider />
            <div>默写区： </div>
            <FlexFormItem
              name="answer"
              rules={[{ required: true, message: '请把内容默写于此' }]}
            >
              <Input.TextArea
                autoSize={{
                  minRows: 8,
                }}
                placeholder="请把内容默写于此"
                allowClear
              />
            </FlexFormItem>
          </FlexForm>
        ) : (
          <CenterEmpty />
        )}
      </Content>
      <RecordFooter>
        <Space style={{ marginRight: '12px' }}>还剩{total}个条目在队列中</Space>
        <Space>
          {renderNextBtn()}
          <Button
            type="primary"
            disabled={flag !== 'normal'}
            onClick={submitHandler}
          >
            提交
          </Button>
        </Space>
      </RecordFooter>
    </Layout>
  );
};
