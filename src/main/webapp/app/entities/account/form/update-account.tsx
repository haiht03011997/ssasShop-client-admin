import { Button, Col, Form, Input, Modal, Row, Switch } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect } from 'react';
import { Container } from 'reactstrap';
import { createEntity, getEntity, updateEntity } from '../account.reducer';

type IUpdateUser = {
  isOpen: boolean;
  onClose: (isReload?: boolean) => void;
  id?: string;
};

export const UserUpdate = React.memo(({ isOpen, onClose, id }: IUpdateUser) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const isNew = id === undefined || id === null;

  const accountsEntity = useAppSelector(state => state.accounts.entity);
  const updating = useAppSelector(state => state.accounts.updating);
  const updateSuccess = useAppSelector(state => state.accounts.updateSuccess);

  const handleClose = () => {
    form.resetFields();
    onClose(updateSuccess);
  };

  useEffect(() => {
    innitData();
  }, [isOpen]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (accountsEntity && !isNew) {
      form.setFieldsValue(accountsEntity);
    }
  }, [accountsEntity]);

  const innitData = () => {
    // get detail
    if (isNew) {
      form.resetFields();
    } else {
      dispatch(getEntity(id));
    }
  };

  const handleSubmit = values => {
    const oldData = !isNew && accountsEntity;
    const entity = {
      ...oldData,
      ...values,
    };
    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      onCancel={() => {
        onClose();
      }}
      footer={null}
      width={900}
    >
      <Container className="form">
        <Form size="large" form={form} onFinish={handleSubmit} layout="vertical">
          <Title level={3}>{`${id ? 'Cập nhật thông tin' : 'Thêm mới'} người dùng`}</Title>
          <Row>
            <Col md={11}>
              <Form.Item label="Họ" rules={[{ required: true, message: 'Hãy nhập họ' }]} name={'firstName'}>
                <Input className="w-100" size="large" placeholder="Nhập họ" />
              </Form.Item>
            </Col>
            <Col md={1} />
            <Col md={12}>
              <Form.Item label="Tên" rules={[{ required: true, message: 'Hãy nhập tên' }]} name={'lastName'}>
                <Input className="w-100" size="large" placeholder="Nhập tên" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item label="Email" rules={[{ required: true, message: 'Hãy nhập địa chỉ email' }]} name={'email'}>
                <Input type="email" className="w-100" size="large" placeholder="Nhập địa chỉ email" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item label="Tình trạng" valuePropName="checked" name={'activated'}>
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Row className="action mt-3" justify="end">
              <Col>
                <Button className="primary" htmlType="submit" disabled={updating}>
                  Lưu
                </Button>
              </Col>
              <Col>
                <Button
                  className="secondary"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Hủy
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Container>
    </Modal>
  );
});

export default UserUpdate;
