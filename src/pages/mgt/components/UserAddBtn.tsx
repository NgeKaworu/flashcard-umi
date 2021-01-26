import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { Modal, Form, Switch, Button } from 'antd';

import SubmitForm from '@/components/SubmitForm';
import EmailInput from '@/components/EmailInput';
import NameInput from '@/components/NameInput';
import PwdInput from '@/components/PwdInput';

import * as http from '@/http';

export default () => {
  const [visible, setVsible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const updater = useMutation(
    (data) => http.RESTful.post('/main/user/create', { data }),
    {
      onSuccess() {
        queryClient.invalidateQueries('user-list');
        form.resetFields();
        visibleHandler();
      },
    },
  );

  function visibleHandler() {
    setVsible((s) => !s);
  }

  function submitHandler() {
    form.validateFields().then(updater.mutate);
  }

  return (
    <>
      <Button type="primary" onClick={visibleHandler}>
        新建用户
      </Button>
      <Modal
        visible={visible}
        onCancel={visibleHandler}
        title="创建用户"
        onOk={submitHandler}
      >
        <SubmitForm
          name="user-edit-form"
          form={form}
          onFinish={submitHandler}
          layout="vertical"
        >
          <EmailInput
            formItemProps={{
              label: '邮箱',
            }}
          />
          <NameInput
            formItemProps={{
              label: '昵称',
            }}
          />
          <PwdInput
            formItemProps={{
              label: '密码',
            }}
          />
          <Form.Item label="管理员" name="isAdmin" valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否"></Switch>
          </Form.Item>
        </SubmitForm>
      </Modal>
    </>
  );
};
