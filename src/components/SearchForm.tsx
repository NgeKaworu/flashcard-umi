import React, { PropsWithChildren, useEffect } from 'react';
import { useHistory } from 'umi';

import { Form, Button } from 'antd';

export interface SearchFormProps {
  isLoading?: boolean;
}

export default (props: PropsWithChildren<SearchFormProps>) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const _location = history.location;

  useEffect(() => {
    const params = new URLSearchParams(_location.search);
    form.setFieldsValue(Object.fromEntries(params.entries()));
  }, [_location.search]);

  function submitHandler(values: any) {
    const o2s = Object.entries(values).reduce(
      (acc, [key, value]) => (acc += `${key}=${value}`),
      '',
    );

    if (o2s !== _location.search && o2s !== '') {
      history.push({
        pathname: _location.pathname,
        search: '?' + o2s,
      });
    }
  }

  function resetHandler() {
    form.resetFields();
    history.push({
      pathname: _location.pathname,
    });
  }

  return (
    <Form
      form={form}
      name="search-form"
      layout="inline"
      onFinish={submitHandler}
    >
      {props.children}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={props.isLoading}>
          搜索
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="ghost" onClick={resetHandler} loading={props.isLoading}>
          重置
        </Button>
      </Form.Item>
    </Form>
  );
};
