import React from 'react';
import { Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import FormItemInput from './FormItemInput';

export default (props?: FormItemInput) => (
  <Form.Item
    name="name"
    rules={[{ required: true, message: '请填写昵称' }]}
    {...props?.formItemProps}
  >
    <Input
      prefix={<UserOutlined />}
      placeholder="Nickname"
      allowClear
      {...props?.inputProps}
    />
  </Form.Item>
);
