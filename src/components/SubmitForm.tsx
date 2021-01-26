import React from 'react';

import { Form, Button } from 'antd';
import { FormProps } from 'antd/lib/form';

// 提供一个隐藏的button接收回车事件
export default (props: FormProps) => {
  return (
    <Form {...props}>
      {props.children}
      <Form.Item style={{ visibility: 'hidden' }}>
        <Button htmlType="submit"></Button>
      </Form.Item>
    </Form>
  );
};
