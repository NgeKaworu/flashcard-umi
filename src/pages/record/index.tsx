import React, { useState, useEffect } from 'react';

import { Input, Layout, Button, Menu, Space, Modal, Form, Radio } from 'antd';

const { Header, Content, Footer } = Layout;

import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';

import { SelectInfo } from 'rc-menu/lib/interface';
import { useHistory } from 'react-router';

const RecordHeader = styled(Header)`
  background: white;
  box-shadow: 0px 1px 20px 5px rgb(0 0 0 / 5%);
  display: flex;
  align-items: center;
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

type dictType = '' | '新建' | '编辑';

export default () => {
  const [sortForm] = Form.useForm();
  const [dictForm] = Form.useForm();
  const history = useHistory();
  const _location = history.location;

  const [sortVisable, setSortVisable] = useState(false);
  const [dictVisable, setDictVisable] = useState(false);
  const [dictType, setDictType] = useState<dictType>('新建');

  useEffect(() => {
    const params = new URLSearchParams(_location.search);
    sortForm.setFieldsValue(Object.fromEntries(params.entries()));
  }, [_location.search]);

  function onMenuSelect({ key }: SelectInfo) {
    const params = new URLSearchParams(_location?.search);
    if (key !== 'all') {
      params.set('type', `${key}`);
    } else {
      params.delete('type');
    }
    history.push({
      pathname: _location.pathname,
      search: params.toString(),
    });
  }

  function showSortModal() {
    setSortVisable(true);
  }

  function hideSortModal() {
    setSortVisable(false);
  }

  function onSortSubmit() {
    sortForm.validateFields().then(({ sort, orderby }) => {
      const params = new URLSearchParams(_location?.search);
      params.set('sort', sort);
      params.set('orderby', orderby);
      history.push({
        pathname: _location.pathname,
        search: params.toString(),
      });
      setSortVisable(false);
    });
  }

  function onSortCancel() {
    const params = new URLSearchParams(_location?.search);
    params.delete('sort');
    params.delete('orderby');
    history.push({
      pathname: _location.pathname,
      search: params.toString(),
    });
    sortForm.resetFields();
    setSortVisable(false);
  }

  function showDictModal(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    console.log(e.currentTarget.dataset);
    setDictType(e.currentTarget.dataset.dictType as dictType);
    setDictVisable(true);
  }

  function hideDictModal() {
    setDictVisable(false);
  }

  function onDictSubmit() {
    dictForm.validateFields().then((values) => {
      console.log(values);
    });
  }
  // const { isLoading, data: res } = useQuery(
  //   ['user-list', _location?.search],
  //   () => {
  //     const {
  //       page,
  //       ...params
  //     }: { [key: string]: string | Number } = Object.fromEntries(
  //       new URLSearchParams(_location?.search),
  //     );

  //     const limit = +params?.limit || 10;
  //     const skip = (+page - 1) * limit || 0;

  //     return http.RESTful.get('/main/user/list', {
  //       params: {
  //         skip,
  //         ...params,
  //       },
  //       silence: 'success',
  //     });
  //   },
  // );

  return (
    <Layout style={{ height: '100%' }}>
      <RecordHeader>
        <Menu
          mode="horizontal"
          style={{ margin: '0 auto' }}
          onSelect={onMenuSelect}
        >
          <Menu.Item key="enabled">可复习</Menu.Item>
          <Menu.Item key="cooling">冷却中</Menu.Item>
          <Menu.Item key="done">己完成</Menu.Item>
          <Menu.Item key="all">全部</Menu.Item>
        </Menu>
        <Button type="link" size="small" onClick={showSortModal}>
          排序
        </Button>
        <Modal
          visible={sortVisable}
          title="排序"
          closable
          onCancel={hideSortModal}
          onOk={onSortSubmit}
        >
          <Form onFinish={onSortSubmit} form={sortForm}>
            <Form.Item
              name="sort"
              label="排序关键字"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio.Button value="reviewAt">复习时间</Radio.Button>
                <Radio.Button value="createAt">添加时间</Radio.Button>
                <Radio.Button value="exp">熟练度</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="orderby"
              label="排序方向"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio.Button value="1">升序</Radio.Button>
                <Radio.Button value="-1">降序</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button style={{ opacity: 0 }} htmlType="submit">
                提交
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="dashed" danger onClick={onSortCancel}>
                取消排序
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </RecordHeader>
      <Content>content</Content>
      <RecordFooter>
        <Space style={{ marginRight: '12px' }}>
          1/1000
          <Button type="dashed">取消选择</Button>
          {/* <Button danger>删除所选</Button> */}
        </Space>
        <Space>
          <Button type="primary">复习所选</Button>
          <Button type="primary">随机复习</Button>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={showDictModal}
            data-dict-type="新建"
          />
        </Space>
      </RecordFooter>
      <Modal
        title={dictType}
        visible={dictVisable}
        onCancel={hideDictModal}
        onOk={onDictSubmit}
      >
        <Form form={dictForm} onFinish={onDictSubmit}>
          <Form.Item name="source" label="原文" rules={[{ required: true }]}>
            <Input.TextArea autoSize allowClear />
          </Form.Item>
          <Form.Item
            name="translation"
            label="译文"
            rules={[{ required: true }]}
          >
            <Input.TextArea autoSize allowClear />
          </Form.Item>
          <Form.Item>
            <Button style={{ opacity: 0 }} htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};
