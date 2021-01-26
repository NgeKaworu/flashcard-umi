import React from 'react';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';

import { Button, Space } from 'antd';

import * as http from '@/http';

import MediaCard from '../components/MediaCard';

export default () => {
  const history = useHistory();

  const { isLoading, data: res } = useQuery('profile', () =>
    http.RESTful.get('/main/profile', { silence: 'success' }),
  );

  function logoutHandler() {
    localStorage.clear();
    history.replace('/login');
  }

  function mgtHandler() {
    history.push('/mgt');
  }

  const data = res?.data;
  return (
    <MediaCard title={<h1>个人档案</h1>}>
      {isLoading ? (
        <div>Loadding...</div>
      ) : (
        <Space direction="vertical">
          <div>昵称：{data?.name}</div>
          <div>邮箱：{data?.email}</div>
          <Space
            direction="vertical"
            style={{
              position: 'absolute',
              bottom: '0',
              width: '100%',
              left: '0',
              padding: '24px',
            }}
          >
            {data?.isAdmin && (
              <Button block onClick={mgtHandler}>
                管理用户
              </Button>
            )}
            <Button block danger ghost onClick={logoutHandler}>
              退出登录
            </Button>
          </Space>
        </Space>
      )}
    </MediaCard>
  );
};
