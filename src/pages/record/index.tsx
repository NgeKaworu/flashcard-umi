import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useInfiniteQuery, useQueryClient } from 'react-query';

import { Input, Layout, Button, Menu, Space, Modal, Form, Radio } from 'antd';

const { Header, Content, Footer } = Layout;

import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';

import { SelectInfo } from 'rc-menu/lib/interface';

import { RESTful } from '@/http';
import { mainHost } from '@/http/host';

import RecordItem from './components/RecordItem';

import { Record } from '@/models/record';

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

const limit = 10;

export default () => {
  const [sortForm] = Form.useForm();
  const [inputForm] = Form.useForm();
  const history = useHistory();
  const _location = history.location;
  const _search = _location.search;

  const [sortVisable, setSortVisable] = useState(false);
  const [dictVisable, setDictVisable] = useState(false);
  const [dictType, setDictType] = useState<dictType>('新建');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(_search);
    sortForm.setFieldsValue(Object.fromEntries(params.entries()));
  }, [_search]);

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['records', _search],
    ({ pageParam = 0 }) => {
      const params: { [key: string]: string | number } = Object.fromEntries(
        new URLSearchParams(_search),
      );

      return RESTful.get(`${mainHost()}/record/list`, {
        silence: 'success',
        params: {
          ...params,
          skip: pageParam * 10,
          limit,
        },
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage?.data?.length === limit ? pages?.length : undefined;
      },
    },
  );

  const datas = data?.pages,
    pages = datas?.reduce((acc, cur) => acc.concat(cur?.data), []),
    total = datas?.[datas?.length - 1]?.total || 0;

  console.log(pages, total);

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

  function showInpurModal(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    console.log(e.currentTarget.dataset);
    setDictType(e.currentTarget.dataset.dictType as dictType);
    setDictVisable(true);
  }

  function hideInputModal() {
    setDictVisable(false);
  }

  function onInputSubmit() {
    inputForm.validateFields().then((values) => {
      console.log(values);
    });
  }

  function onItemClick(id: string) {
    setSelectedItems((s) => {
      const checked = s.some((i) => i === id);
      return checked ? s.filter((i) => i !== id) : s.concat(id);
    });
  }

  function onItemRemoveClick(id: string) {
    console.log(id);
  }

  function onItemEditClick(record: Record) {
    console.log(record);
  }

  function cancelAllSelect() {
    setSelectedItems([]);
  }

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
      <Content style={{ overflowY: 'auto' }}>
        {pages?.map((record: Record) => {
          const selected = selectedItems.some((s) => s === record?._id);
          return (
            <RecordItem
              key={record._id}
              record={record}
              selected={selected}
              onClick={onItemClick}
              onEditClick={onItemEditClick}
              onRemoveClick={onItemRemoveClick}
            />
          );
        })}
      </Content>
      <RecordFooter>
        <Space style={{ marginRight: '12px' }}>
          {selectedItems.length}/{total}
          <Button type="dashed" onClick={cancelAllSelect}>
            取消选择
          </Button>
          {/* <Button danger>删除所选</Button> */}
        </Space>
        <Space>
          <Button type="primary">复习所选</Button>
          <Button type="primary">随机复习</Button>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={showInpurModal}
            data-dict-type="新建"
          />
        </Space>
      </RecordFooter>
      <Modal
        title={dictType}
        visible={dictVisable}
        onCancel={hideInputModal}
        onOk={onInputSubmit}
      >
        <Form form={inputForm} onFinish={onInputSubmit}>
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
