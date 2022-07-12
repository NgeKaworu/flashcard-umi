import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useLocation, useHistory } from 'react-router';

import { ConfigProvider, Layout } from 'antd';

import { FormOutlined, SyncOutlined } from '@ant-design/icons';

const { Content, Footer } = Layout;

import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.less';

const queyClient = new QueryClient();

const menu = [
  {
    title: '新词本',
    path: '/record/',
    icon: <FormOutlined />,
    query: { type: 'enable' },
  },
  { title: '复习', path: '/review/', icon: <SyncOutlined /> },
];

export default (props: PropsWithChildren<any>) => {
  const { pathname } = useLocation();
  const history = useHistory();

  function onMenuClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const path: string = e?.currentTarget?.dataset?.path as string,
      query = menu.find((m) => m?.path === path)?.query;

    history.push({
      pathname: path,
      search: new URLSearchParams(query)?.toString(),
    });
  }
  return (
    <QueryClientProvider client={queyClient}>
      <ConfigProvider locale={zhCN}>
        <Layout className={styles['layout']}>
          <Content className={styles['content']}>{props.children}</Content>
          <Footer className={styles['footer']}>
            {menu.map((i) => (
              <div
                className={[
                  styles?.['menu-item'],
                  i.path.includes(pathname) && styles?.['active'],
                ]?.join(' ')}
                key={i.path}
                data-path={i.path}
                onClick={onMenuClick}
              >
                {i.icon}
                {i.title}
              </div>
            ))}
          </Footer>
        </Layout>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
