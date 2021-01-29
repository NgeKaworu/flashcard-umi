import React from 'react';

import { Layout, Button, Menu, Space } from 'antd';

const { Header, Content, Footer } = Layout;

import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';

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

export default () => (
  <Layout style={{ height: '100%' }}>
    <RecordHeader>
      <Menu mode="horizontal" style={{ margin: '0 auto' }}>
        <Menu.Item>可复习</Menu.Item>
        <Menu.Item>冷却中</Menu.Item>
        <Menu.Item>己完成</Menu.Item>
        <Menu.Item>全部</Menu.Item>
      </Menu>
      <Button type="link" size="small">
        排序
      </Button>
    </RecordHeader>
    <Content>content</Content>
    <RecordFooter>
      <Space style={{ marginRight: '12px' }}>
        1/1000
        <Button type="dashed">取消选择</Button>
        <Button danger>删除所选</Button>
      </Space>
      <Space>
        <Button type="primary">复习所选</Button>
        <Button type="primary">随机复习</Button>
        <Button type="primary" shape="circle" icon={<PlusOutlined />} />
      </Space>
    </RecordFooter>
  </Layout>
);
