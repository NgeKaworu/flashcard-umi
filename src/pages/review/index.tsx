import React, { Fragment, useEffect, useState } from 'react';
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

import { RESTful } from '@/http';
import { mainHost } from '@/http/host';

import { Record } from '@/models/record';
import moment from 'moment';

import styles from '@/index.less';
import reviewStyles from './index.less';

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

  function findOneNearestNeedReview() {
    return RESTful.get(`${mainHost()}/record/list?sort=cooldownAt&orderby=-1`, {
      silence: 'success',
      params: {
        inReview: false,
        skip: 0,
        limit: 1,
      },
    }).then((data: any) => data);
  }

  const datas = data?.data,
    curRencord: Record = datas?.[curIdx];

  const [source, setSource] = useState<React.ReactChild>('');

  useEffect(() => {
    setSource(curRencord?.source);
  }, [curRencord?.source]);

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
  const hasNext = curIdx < total - 1;

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
      // 艾宾浩斯遗忘曲线
      switch (exp) {
        case 5:
        case 45:
          data.cooldownAt = now.add(5, 'minutes');
          data.exp = exp + 5;
          break;
        case 10:
        case 50:
          data.cooldownAt = now.add(25, 'minutes');
          data.exp = exp + 5;
          break;
        case 15:
        case 55:
          data.cooldownAt = now.add(11.5, 'hours');
          data.exp = exp + 5;
          break;
        case 20:
        case 60:
          data.cooldownAt = now.add(12, 'hours');
          data.exp = exp + 5;
          break;
        case 25:
        case 65:
          data.cooldownAt = now.add(1, 'day');
          data.exp = exp + 5;
          break;
        case 30:
        case 70:
          data.cooldownAt = now.add(2, 'days');
          data.exp = exp + 5;
          break;
        case 35:
        case 75:
          data.cooldownAt = now.add(3, 'days');
          data.exp = exp + 5;
          break;
        case 40:
        case 80:
          data.cooldownAt = now.add(8, 'days');
          data.exp = exp + 5;
          break;
        case 85:
          data.cooldownAt = now.add(1, 'days');
          data.exp = exp + 5;
          break;
        case 90:
          data.cooldownAt = now.add(0.5, 'month');
          data.exp = exp + 5;
          break;
        case 95:
          data.cooldownAt = now.add(1, 'hours');
          data.exp = exp + 5;
          break;
        case 100:
          data.cooldownAt = now.add(1, 'hours');
          break;
        default:
          console.error('invalidate exp type: ', exp);
          break;
      }
    }
    data.cooldownAt = data.cooldownAt?.toISOString();
    mutate(data);
    if (!hasNext) {
      notifyMe();
    }
  }

  function onForget() {
    const id = curRencord?._id;
    const now = moment();
    let exp = curRencord?.exp;
    // 经验降一级
    if (exp !== 0) {
      exp -= 5;
    }

    const data: { [key: string]: any } = {
      id,
      //   冷却一小时
      cooldownAt: now.add(1, 'hour'),
      exp,
    };
    data.cooldownAt = data.cooldownAt?.toISOString();
    mutate(data);
    if (!hasNext) {
      notifyMe();
    }
  }

  function notifyMe() {
    Notification.requestPermission(function (result) {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(async function (registration) {
          const nextReviewRecord = await findOneNearestNeedReview(),
            nextReviewTime = nextReviewRecord?.data?.[0]?.reviewAt;

          if (nextReviewTime !== undefined) {
            let nextTime = moment(nextReviewTime).diff(moment());
            // 最短一小时
            if (nextTime < 3600000) {
              nextTime = 3600000;
            }
            setTimeout(() => {
              registration.showNotification('复习提醒', {
                body: '你有单词需要复习～',
                // icon: '../images/touch/chrome-touch-icon-192x192.png', // icon
                vibrate: [200, 100, 200, 100, 200, 100, 200], // 抖动
                tag: 'review-notify', // 唯一ID
              });
            }, nextTime);
          }
        });
      }
    });
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
    switch (flag) {
      case 'normal':
        return (
          <Button disabled={total <= 1} onClick={onNext}>
            跳过当前
          </Button>
        );
      case 'success':
      case 'fail':
        return (
          <Space>
            <Button
              onClick={onRemember}
              loading={isLoading}
              style={{ background: 'lightgreen' }}
            >
              记忆成功，{hasNext ? '下一项' : '完成复习'}
            </Button>

            {flag === 'fail' && (
              <Button
                type="primary"
                danger
                onClick={onForget}
                loading={isLoading}
              >
                记忆失败,{hasNext ? '下一项' : '完成复习'}
              </Button>
            )}
          </Space>
        );
      default:
        console.error('invalidate type: ', flag);
    }
  }

  function submitHandler() {
    form.validateFields().then((values) => {
      const answer = values.answer?.trim(),
        actual = curRencord?.source?.trim();
      if (answer === actual) {
        setFlag('success');
      } else {
        const actualDict = actual
            ?.split(' ')
            ?.reduce((acc: { [key: string]: number }, cur) => {
              if (acc[cur] === undefined) {
                acc[cur] = 1;
              } else {
                acc[cur]++;
              }
              return acc;
            }, {}),
          diff: Array<React.ReactNode> = answer
            ?.split(' ')
            ?.map((i: string, idx: number) => {
              let ele: React.ReactNode;
              if (actualDict[i] > 0) {
                actualDict[i]--;
                ele = i;
              } else {
                ele = <span style={{ background: 'lightcoral' }}>{i}</span>;
              }
              return <Fragment key={idx}>{ele} </Fragment>;
            });

        setSource(
          <>
            {actual}
            <br />
            {diff}
          </>,
        );
        setFlag('fail');
      }
    });
  }

  function onHotKey({ key, metaKey }: React.KeyboardEvent) {
    if (key === 'Enter' && metaKey) {
      submitHandler();
    }
  }

  return (
    <Layout>
      <Header className={styles['header']}>{renderTitle()}</Header>
      <Content className={reviewStyles['content']}>
        {datas?.length ? (
          <Form className={reviewStyles['form']} form={form}>
            <Form.Item className={reviewStyles['form-item']}>
              <div>译文： </div>
              {curRencord?.translation}
            </Form.Item>
            <Divider />
            <div>默写区： </div>
            <Form.Item
              className={reviewStyles['form-item']}
              name="answer"
              rules={[{ required: true, message: '请把内容默写于此' }]}
            >
              <Input.TextArea
                autoFocus
                onKeyDown={onHotKey}
                autoSize={{ minRows: 8 }}
                placeholder="请把内容默写于此"
                allowClear
              />
            </Form.Item>
            <Divider />
            <Form.Item className={reviewStyles['form-item']}>
              <div>原文： </div>
              {flag !== 'normal' ? source : <Skeleton />}
            </Form.Item>
          </Form>
        ) : (
          <Empty className={styles['empty']} />
        )}
      </Content>
      <Footer className={styles['footer']}>
        <Space style={{ marginRight: '12px', whiteSpace: 'pre-wrap' }}>
          余{total}
        </Space>
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
      </Footer>
    </Layout>
  );
};
