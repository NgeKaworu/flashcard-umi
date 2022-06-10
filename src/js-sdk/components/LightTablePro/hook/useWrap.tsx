import type { FormInstance } from 'antd';
import { Form } from 'antd';
import type { FormProps, TableProps, PaginationProps } from 'antd';
import type React from 'react';
import { useState, useRef } from 'react';
import type { LightTableProps } from '../../LightTable';
import type { QueryKey, QueryFunction, UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';
import type { ActionRef } from '..';
import useURLSearch from '@/edk/hooks/useURLSearch';

type RequestParameters<RecordType> = Parameters<
  NonNullable<LightTableProps<RecordType>['onChange']>
>;

type Response<RecordType extends Record<any, any> = any> = {
  data: RecordType[];
  success: boolean;
  total: number;
  page: number;
};

interface Parameter<RecordType extends Record<any, any> = any> {
  manualRequest?: boolean;
  queryKey?: QueryKey;
  queryOptions?: Omit<UseQueryOptions<Response | undefined>, 'queryKey' | 'queryFn'>;
  request?: (
    params?: RecordType,
    pagination?: RequestParameters<RecordType>[0],
    sorter?: RequestParameters<RecordType>[2],
    filters?: RequestParameters<RecordType>[1],
    extra?: Parameters<QueryFunction>,
  ) => Promise<Response>;
  pagination?: LightTableProps<RecordType>['pagination'];
}

interface Result<RecordType extends Record<any, any> = any> {
  formHandler: FormProps;
  tableHandler: Omit<TableProps<RecordType>, 'columns'>;
  formRef: React.MutableRefObject<FormInstance>;
  actionRef: React.MutableRefObject<ActionRef>;
  current: number;
}

let n = 0;
export default function useWrap<RecordType extends Record<any, any> = any>({
  queryKey,
  queryOptions,
  request,
  manualRequest,
  pagination,
}: Parameter): Result {
  const currentRef = useRef(n++),
    [enabled, setEnabled] = useState(!manualRequest),
    [form] = Form.useForm<RecordType>(),
    [tableState, setTableState] = useState<Partial<RequestParameters<RecordType>>>();
  const { setURLSearch } = useURLSearch({ onURLSearchChange: setTableState, key: 'tableState' }),
    responser = useQuery(
      _queryKey(queryKey),
      async (...extra) =>
        request?.(
          await form.validateFields(),
          _pagination(),
          tableState?.[2],
          tableState?.[1],
          extra,
        ),
      enabled === false ? { enabled } : queryOptions,
    ),
    formRef = useRef<FormInstance>(form),
    actionRef = useRef<ActionRef>({
      reload: responser.refetch,
      reset: form.resetFields,
      reloadAndReset,
    });

  function _queryKey(q?: QueryKey) {
    const sol = q ?? currentRef.current;
    return ([] as unknown[]).concat(sol, tableState);
  }

  function _pagination(): PaginationProps | undefined {
    return pagination !== false
      ? {
          ...pagination,
          total: responser?.data?.total,
          current: responser?.data?.page,
          pageSize: pagination?.pageSize ?? pagination?.defaultPageSize ?? 20,
          showQuickJumper: true,
          showTotal: (total, range) => `共 ${total} 条记录 第 ${range?.[0]}/${range?.[1]} 条`,
          ...tableState?.[0],
        }
      : void 0;
  }

  function reloadAndReset() {
    setURLSearch(void 0);
    form.resetFields();
    responser.refetch();
  }

  function onReset() {
    form.resetFields();
    responser.refetch();
  }

  function onFinish() {
    setEnabled(true);
    setURLSearch(void 0);
    responser.refetch();
  }

  const onTableChange: LightTableProps<RecordType>['onChange'] = (p, f, s) =>
    setURLSearch([p, f, s]);

  return {
    formHandler: {
      onReset,
      onFinish,
      form,
    },
    tableHandler: {
      onChange: onTableChange,
      pagination: _pagination(),
      dataSource: responser?.data?.data,
      loading: responser?.isFetching,
    },
    actionRef,
    formRef,
    current: currentRef.current,
  };
}
