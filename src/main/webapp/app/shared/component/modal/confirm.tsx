import { Button, Modal } from 'antd';
import React from 'react';

type IModalConfirmProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  content?: string;
  title: string;
};

const ModalConfirmComponent = (props: IModalConfirmProps) => {
  return (
    <Modal
      width={300}
      title={props.title}
      open={props.visible}
      onOk={props.onConfirm}
      okType="danger"
      onCancel={props.onCancel}
      footer={
        <div className="d-flex justify-content-end gap-1">
          <Button key="back" className="secondary" onClick={props.onCancel}>
            Hủy
          </Button>
          <Button key="submit" className="primary" onClick={props.onConfirm}>
            Đồng ý
          </Button>
        </div>
      }
    >
      <p>{props.content}</p>
    </Modal>
  );
};

export default ModalConfirmComponent;
