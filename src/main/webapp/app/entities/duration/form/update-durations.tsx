import { Button, Col, Form, Input, Modal, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect } from 'react';
import { Container } from 'reactstrap';
import { createEntity, getEntity, updateEntity } from '../duration.reducer';
import TextArea from 'antd/es/input/TextArea';

type IUpdateDurations = {
  isOpen: boolean;
  onClose: (isReload?: boolean) => void;
  id?: string;
};

export const DurationsUpdate = React.memo(({ isOpen, onClose, id }: IUpdateDurations) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const isNew = id === undefined || id === null;

  const durationsEntity = useAppSelector(state => state.durations.entity);
  const updating = useAppSelector(state => state.durations.updating);
  const updateSuccess = useAppSelector(state => state.durations.updateSuccess);

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
    if (durationsEntity && !isNew) {
      form.setFieldsValue(durationsEntity);
    }
  }, [durationsEntity]);

  const innitData = () => {
    // get detail
    if (isNew) {
      form.resetFields();
    } else {
      dispatch(getEntity(id));
    }
  };

  const handleSubmit = values => {
    const oldData = !isNew && durationsEntity;
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
          <Title level={3}>{`${id ? 'Cập nhật thông tin' : 'Thêm mới'} loại dịch vụ`}</Title>
          <Row>
            <Col md={24}>
              <Form.Item label="Thời hạn" rules={[{ required: true, message: 'Hãy nhập thời hạn' }]} name={'name'}>
                <Input className="w-100" size="large" placeholder="Nhập thời hạn" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item label="Mô tả" name={'description'}>
                <TextArea rows={3} className="w-100" size="large" placeholder="Nhập mô tả" />
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

export default DurationsUpdate;
