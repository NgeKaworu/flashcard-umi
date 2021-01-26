import React from 'react';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';

import { Card, Form, Input, Space, Table, Tag } from 'antd';
import moment from 'moment';

import * as http from '@/http';
import SearchForm from '@/components/SearchForm';
import UserOperator, { User } from './components/UserOperator';
import UserAddBtn from './components/UserAddBtn';

export default () => {
  const history = useHistory();
  const _location = history.location;

  const { isLoading, data: res } = useQuery(
    ['user-list', _location?.search],
    () => {
      const {
        page,
        ...params
      }: { [key: string]: string | Number } = Object.fromEntries(
        new URLSearchParams(_location?.search),
      );

      const limit = +params?.limit || 10;
      const skip = (+page - 1) * limit || 0;

      return http.RESTful.get('/main/user/list', {
        params: {
          skip,
          ...params,
        },
        silence: 'success',
      });
    },
  );

  function dateFormat(date: string) {
    return date && moment(date).format('YYYY/MM/DD');
  }

  function isAdmin(role: boolean) {
    return role ? <Tag color="green">管理员</Tag> : <Tag>用户</Tag>;
  }

  function pageChangeHandler(page: number, limit?: number) {
    const params = new URLSearchParams(_location?.search);
    params.set('page', `${page}`);
    params.set('limit', `${limit}`);
    history.push({
      pathname: _location.pathname,
      search: params.toString(),
    });
  }

  const columns = [
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '昵称',
      dataIndex: 'name',
    },
    {
      title: '注册日期',
      dataIndex: 'createAt',
      render: dateFormat,
    },
    {
      title: '修改日期',
      dataIndex: 'updateAt',
      render: dateFormat,
    },
    {
      title: '权限',
      dataIndex: 'isAdmin',
      render: isAdmin,
    },
    {
      title: '操作',
      dataIndex: 'operator',
      render: (_: undefined, record: User) => <UserOperator user={record} />,
    },
  ];

  return (
    <Card
      style={{
        width: '100%',
        height: '100%',
        margin: '24px',
        minHeight: '800px',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <SearchForm isLoading={isLoading}>
          <Form.Item name="keyword">
            <Input placeholder="输入关键字以查询" allowClear></Input>
          </Form.Item>
        </SearchForm>

        <UserAddBtn />

        <Table
          loading={isLoading}
          rowKey="id"
          columns={columns}
          dataSource={res?.data}
          pagination={{
            total: res?.total,
            onChange: pageChangeHandler,
          }}
        />
      </Space>
    </Card>
  );
};
