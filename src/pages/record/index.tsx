import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  createContext,
} from 'react';
import { useHistory } from 'react-router';
import { useInfiniteQuery, useQueryClient, useMutation } from 'react-query';
import {
  VariableSizeList as List,
  ListOnItemsRenderedProps,
} from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import {
  Empty,
  Input,
  Layout,
  Button,
  Menu,
  Space,
  Modal,
  Form,
  Radio,
} from 'antd';

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

const CenterEmpty = styled(Empty)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

type inputType = '' | '新建' | '编辑';
type OnItemsRendered = (props: ListOnItemsRenderedProps) => any;

const limit = 10;

export const ChatContext = createContext({});

export default () => {
  const [sortForm] = Form.useForm();
  const [inputForm] = Form.useForm();
  const history = useHistory();
  const _location = history.location;
  const _search = _location.search;
  const params = new URLSearchParams(_search);
  const selectedKeys = [params.get('type') || 'all'];

  const [sortVisable, setSortVisable] = useState(false);
  const [inputVisable, setInputVisable] = useState(false);
  const [inputType, setInputType] = useState<inputType>('新建');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentRect, setContentRec] = useState<DOMRect>();

  // 编辑modal使用
  const [curRecrod, setCurRecord] = useState<Record>();

  useLayoutEffect(() => {
    const current = contentRef.current;
    const obj = current?.getBoundingClientRect();
    obj && setContentRec(obj);
  }, [contentRef]);

  useEffect(() => {
    const params = new URLSearchParams(_search);
    sortForm.setFieldsValue(Object.fromEntries(params.entries()));
  }, [_search]);

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['records-list', _search],
    ({ pageParam = 0 }) => {
      const params: { [key: string]: string | number } = Object.fromEntries(
        new URLSearchParams(_search),
      );

      return RESTful.get(`${mainHost()}/record/list`, {
        silence: 'success',
        params: {
          ...params,
          skip: pageParam * limit,
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

  const sizeMap = useRef<{ [key: string]: number }>({});
  const setSize = useCallback((id, size) => {
    console.log('set');
    sizeMap.current = { ...sizeMap.current, [id]: size };
  }, []);

  const getSize = useCallback((index) => {
    const id = pages?.[index]._id;
    console.log('get');
    return sizeMap.current[id] || 50;
  }, []);

  const creator = useMutation(
    (data) => RESTful.post(`${mainHost()}/record/create`, { data }),
    {
      onSuccess() {
        queryClient.invalidateQueries('records-list');
        inputForm.resetFields();
        setInputVisable(false);
      },
    },
  );

  const updater = useMutation(
    (data?: { [key: string]: any }) =>
      RESTful.put(`${mainHost()}/record/update`, {
        data: { id: curRecrod?._id, ...data },
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries('records-list');
        inputForm.resetFields();
        setInputVisable(false);
      },
    },
  );

  const deleter = useMutation(
    (data?: string) => RESTful.delete(`${mainHost()}/record/remove/${data}`),
    {
      onSuccess() {
        queryClient.invalidateQueries('records-list');
      },
    },
  );

  function onMenuSelect({ key }: SelectInfo) {
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
    setInputType(e.currentTarget.dataset.inputType as inputType);
    setInputVisable(true);
  }

  function hideInputModal() {
    setInputVisable(false);
  }

  function onInputSubmit() {
    inputForm.validateFields().then((values) => {
      switch (inputType) {
        case '新建':
          creator.mutate(values);
          break;
        case '编辑':
          updater.mutate(values);
          break;
        default:
          console.error('invalidate type:', inputType);
      }
    });
  }

  function onItemClick(id: string) {
    setSelectedItems((s) => {
      const checked = s.some((i) => i === id);
      return checked ? s.filter((i) => i !== id) : s.concat(id);
    });
  }

  function onItemRemoveClick(id: string) {
    deleter.mutate(id);
  }

  function onItemEditClick(record: Record) {
    inputForm.setFieldsValue(record);
    setCurRecord(record);
    setInputType('编辑');
    setInputVisable(true);
  }

  function cancelAllSelect() {
    setSelectedItems([]);
  }

  // react-window-infinite
  // const length = pages?.length || 0;
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  // const itemCount = hasNextPage ? length + 1 : length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isFetching ? () => null : () => fetchNextPage();

  // Every row is loaded except for our loading indicator row.
  // const isItemLoaded = index => !hasNextPage || index < pages.length;
  const isItemLoaded = (index: number) => !hasNextPage || index < pages?.length;

  const getItemKey = (index: number, data: Record[]) => data?.[index]?._id;

  // Render an item or a loading indicator.
  function renderItem({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) {
    const record = pages[index];
    const selected = selectedItems.some((s) => s === record?._id);

    let content;
    if (!isItemLoaded(index)) {
      content = 'Loading...';
    } else {
      content = (
        <RecordItem
          key={record._id}
          record={record}
          selected={selected}
          onClick={onItemClick}
          onEditClick={onItemEditClick}
          onRemoveClick={onItemRemoveClick}
        />
      );
    }

    return <div style={style}>{content}</div>;
  }

  // Render List
  function renderList({
    onItemsRendered,
    ref,
  }: {
    onItemsRendered: OnItemsRendered;
    ref: React.Ref<any>;
  }) {
    return (
      <ChatContext.Provider value={{ setSize }}>
        <List
          style={{ paddingBottom: '12px' }}
          height={contentRect?.height || 0}
          width={'100%'}
          itemCount={total}
          onItemsRendered={onItemsRendered}
          ref={ref}
          itemSize={getSize}
          // itemData={pages}
          // itemKey={getItemKey}
        >
          {renderItem}
        </List>
      </ChatContext.Provider>
    );
  }

  function calcItemSize(index: number) {
    const record = pages[index];
    console.log(index, record);
    const width = contentRect?.width || 0;
    const lineHeight = 22;
    // 基本高度 = Item高度 - 两行文本内容 + padding
    let baseHeight = 125 - lineHeight * 2 + 12;

    // 基本宽度 = 屏幕宽度 - padding*2 - margin*2
    const baseWidth = width - 12 * 2 - 12 * 2;
    // 字号
    const fontSize = 14;
    // 原文 长度
    const sl = record?.source?.length * fontSize || 1;
    //译文 长度
    const tl = record?.translation?.length * fontSize || 1;

    // 总行数
    const rowNums = Math.ceil(sl / baseWidth) + Math.ceil(tl / baseWidth);

    let rowHeight = rowNums * lineHeight + baseHeight;

    // 0.75为系数，全角字符是14px半角则是一半；
    if (rowNums > 2) {
      rowHeight *= 0.75;
    }

    return rowHeight;
  }

  return (
    <Layout style={{ height: '100%' }}>
      <RecordHeader>
        <Menu
          mode="horizontal"
          style={{ margin: '0 auto' }}
          onSelect={onMenuSelect}
          selectedKeys={selectedKeys}
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
      <Content>
        <div style={{ width: '100%', height: '100%' }} ref={contentRef}>
          {pages?.length ? (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={total}
              loadMoreItems={loadMoreItems}
            >
              {renderList}
            </InfiniteLoader>
          ) : (
            <CenterEmpty />
          )}
        </div>
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
            data-input-type="新建"
          />
        </Space>
      </RecordFooter>
      <Modal
        title={inputType}
        visible={inputVisable}
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
