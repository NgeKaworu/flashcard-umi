import React from 'react';
import { Form, Input } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import FormItemInput from './FormItemInput';

export default (props?: FormItemInput) => (
  <Form.Item
    name="pwd"
    rules={[
      { required: true, message: '密码不能为空' },
      { min: 8, message: '密码最短应为8位' },
    ]}
    {...props?.formItemProps}
  >
    <Input
      prefix={<LockOutlined />}
      type="password"
      placeholder="Password"
      allowClear
      {...props?.inputProps}
    />
  </Form.Item>
);
