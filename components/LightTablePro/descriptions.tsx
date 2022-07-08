import type { MutableRefObject, ReactNode, Ref } from 'react';
import { Card, Descriptions, Pagination } from 'antd';
import type { FormInstance, FormProps, DescriptionsProps, PaginationProps, TableProps } from 'antd';
import type { LightColumnProps, LightTableProps } from '../LightTable';
import type { SearchColumnsProps } from '../Search';
import Search from '../Search';
import type { QueryKey, QueryFunction, UseQueryOptions } from 'react-query';
import useWrap from './hook/useWrap';
import styles from './index.module.less';
import getIn from '@/edk/struct/tree/getIn';

export { default as useLightTablePro } from './hook/useLightTablePro';
export { default as useWrap } from './hook/useWrap';

const { Item } = Descriptions;

type RequestParameters<RecordType> = Parameters<
  NonNullable<LightTableProps<RecordType>['onChange']>
>;

export interface ActionRef {
  reload?: () => void;
  reloadAndReset?: () => void;
  reset?: () => void;
}

export interface LightTableProColumnProps<RecordType>
  extends LightColumnProps<RecordType>,
    SearchColumnsProps<RecordType> {}

export interface LightDescriptionsProProps<RecordType> extends DescriptionsProps {
  rowKey?: TableProps<RecordType>['rowKey'];
  pagination?: PaginationProps;
  formRef?: MutableRefObject<FormInstance | undefined>;
  formProps?: FormProps;
  columns?: LightTableProColumnProps<RecordType>[];
  manualRequest?: boolean;
  queryKey?: QueryKey;
  queryOptions?: Omit<
    UseQueryOptions<
      | {
          data: RecordType[];
          success: boolean;
          total: number;
          page: number;
        }
      | undefined
    >,
    'queryKey' | 'queryFn'
  >;
  request?: (
    params?: RecordType,
    pagination?: RequestParameters<RecordType>[0],
    sorter?: RequestParameters<RecordType>[2],
    filters?: RequestParameters<RecordType>[1],
    extra?: Parameters<QueryFunction>,
  ) => Promise<{
    data: RecordType[];
    success: boolean;
    total: number;
    page: number;
  }>;
  actionRef?: MutableRefObject<ActionRef | undefined>;
  headerTitle?: ReactNode;
  toolBarRender?: ReactNode;

  tableCardRef?: Ref<HTMLDivElement>;
}

export default function LightDescriptionsPro<RecordType extends Record<any, any> = any>({
  columns,
  formRef,
  actionRef,
  formProps,
  queryKey,
  queryOptions,
  request,
  manualRequest,
  pagination,
  headerTitle,
  toolBarRender,
  children,
  tableCardRef,
  ...props
}: LightDescriptionsProProps<RecordType>) {
  const {
    formHandler,
    tableHandler,
    actionRef: innerActionRef,
    formRef: innerFormRef,
  } = useWrap({
    queryKey,
    queryOptions,
    request,
    manualRequest,
    pagination,
  });

  if (formRef) {
    formRef.current = innerFormRef.current;
  }

  if (actionRef) {
    actionRef.current = innerActionRef.current;
  }

  return (
    <div className={`${styles.flex} ${styles.column}`}>
      <Card>
        <Search
          columns={columns}
          formProps={{
            ...formHandler,
            ...formProps,
          }}
        />
      </Card>
      {children}
      <div ref={tableCardRef}>
        <Card>
          <div className={`${styles.flex} ${styles.column}`}>
            <div className={`${styles.flex} ${styles?.['space-between']}`}>
              <div>{headerTitle}</div>
              <div>{toolBarRender}</div>
            </div>
            {tableHandler?.dataSource?.map((d) => (
              <Descriptions
                key={
                  typeof props?.rowKey === 'function'
                    ? props?.rowKey?.(d)
                    : d[props?.rowKey ?? 'id']
                }
                {...props}
              >
                {columns?.reduce((acc: ReactNode[], c, i) => {
                  const { hideInTable, dataIndex, render } = c;
                  if (!dataIndex || hideInTable) return acc;
                  const r = render,
                    v = getIn(d, dataIndex),
                    dom = r?.(v, d, i) ?? v;
                  if (!dom) return acc;
                  return acc.concat(
                    <Item key={`${c?.dataIndex}`} label={c.title} span={c.colSpan ?? c.colSize}>
                      {dom}
                    </Item>,
                  );
                }, [])}
              </Descriptions>
            ))}

            <div className={styles?.pagination}>
              <Pagination
                {...tableHandler.pagination}
                size="small"
                onChange={(current, pageSize) =>
                  tableHandler?.onChange?.({ current, pageSize }, {}, {}, {} as any)
                }
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
