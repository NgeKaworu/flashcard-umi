import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import type { PropsWithChildren } from "react";

import { ConfigProvider, Layout } from "antd";

const { Content } = Layout;

import zhCN from "antd/es/locale/zh_CN";

const queyClient = new QueryClient();

export default (props: PropsWithChildren<any>) => {
  return <QueryClientProvider client={queyClient}>
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: "100%" }}>
        <Content
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </ConfigProvider>
  </QueryClientProvider>;
};
