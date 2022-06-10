import { useState } from 'react';
import type { FormInstance, FormProps } from 'antd';
import { Form } from 'antd';

export type ContainerProps<T> = T & {
  onClose?: (...args: any) => void;
  confirmLoading?: boolean;
  visible?: boolean;
};

export interface InitValue<T> {
  containerProps?: ContainerProps<T>;
  formProps?: FormProps;
  data?: any;
  form?: FormInstance;
}

export default <T>(initValue?: InitValue<T>) => {
  const [form] = Form.useForm(initValue?.form);

  const [containerProps, setContainerProps] = useState<ContainerProps<T>>({
    onClose: close,
    ...initValue?.containerProps,
  } as ContainerProps<T>);

  const [formProps, setFormProps] = useState<FormProps>({
    form,
    layout: 'vertical',
    ...initValue?.formProps,
    validateMessages: { required: '${label} 是必选字段' },
  });

  const [data, setData] = useState<any>(initValue?.data);

  function close() {
    setContainerProps((pre) => ({ ...pre, visible: false }));
    form.resetFields();
    setData(undefined);
  }

  return {
    form,
    containerProps,
    setContainerProps,
    formProps,
    setFormProps,
    data,
    setData,
    close,
  };
};
