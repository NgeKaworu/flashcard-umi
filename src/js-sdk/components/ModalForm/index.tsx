import type { PropsWithChildren } from 'react';
import { Modal, Form } from 'antd';
import type { InitValue } from './useModalForm';
export { default as useModalForm } from './useModalForm';

const ModalForm = ({ children, modalProps, formProps }: PropsWithChildren<InitValue>) => (
  <Modal {...modalProps}>
    <Form {...formProps}>
      {children}
      <Form.Item hidden>
        <button html-type="submit" />
      </Form.Item>
    </Form>
  </Modal>
);

export default ModalForm;
