import type { FormProps } from 'antd';
import { Form } from 'antd';
import useURLSearch from '../hooks/useURLSearch';

export interface SearchFormProps {
  formProps?: FormProps;
}

/**
 * SearchForm
 * 单一责任, 仅负责Form值和search双向绑定
 */
export default (({ formProps, children }) => {
  const {
    onFinish,
    onReset,
    name = 'search_form',
    form: outerForm,
    ...restFormProps
  } = formProps || {};
  const [form] = outerForm ? [outerForm] : Form.useForm();

  const { setURLSearch } = useURLSearch({
    key: name,
    onURLSearchChange,
  });

  function onURLSearchChange(values: any) {
    if (values) {
      form.setFieldsValue(values);
      onFinish?.(values);
    } else {
      form.resetFields();
      onReset?.(values);
    }
  }

  const _onReset: FormProps['onReset'] = (...e) => {
    onReset?.(...e);
    setURLSearch(restFormProps.initialValues);
  };

  return (
    <Form
      form={form}
      name={name}
      labelCol={{ offset: 1, span: 6 }}
      wrapperCol={{ span: 17 }}
      onFinish={setURLSearch}
      onReset={_onReset}
      {...restFormProps}
    >
      {children}
    </Form>
  );
}) as React.FC<SearchFormProps>;
