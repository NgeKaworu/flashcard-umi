import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useMutation } from 'react-query';

import { Button, Form } from 'antd';

import * as http from '@/http';

import EmailInput from '@/components/EmailInput';
import PwdInput from '@/components/PwdInput';
import NameInput from '@/components/NameInput';
import MediaCard from '@/components/MediaCard';

export default () => {
  const [flag, setFlag] = useState('登录');
  const history = useHistory();

  const finshHandler = useMutation(
    (values) => {
      const urls: { [key: string]: string } = {
        登录: '/main/login',
        注册: '/main/register',
      };
      return http.RESTful.post(urls[flag], { data: values });
    },
    {
      onSuccess(res: { data: string; ok: boolean }) {
        localStorage.setItem('token', res.data);
        history.replace('/profile');
      },
    },
  );

  function toggleFlag() {
    setFlag((f) => (f === '登录' ? '注册' : '登录'));
  }

  return (
    <MediaCard title={<h1>{flag}</h1>}>
      <Form name="login-form" onFinish={finshHandler.mutate}>
        <EmailInput />
        {flag === '注册' && <NameInput />}
        <PwdInput />
        <Form.Item
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            padding: '24px',
            width: '100%',
          }}
        >
          <Button
            loading={finshHandler.isLoading}
            type="primary"
            htmlType="submit"
            block
          >
            {flag}
          </Button>
          或{' '}
          <a onClick={toggleFlag}>
            {flag === '登录' ? '现在注册!' : '返回登录'}
          </a>
        </Form.Item>
      </Form>
    </MediaCard>
  );
};
