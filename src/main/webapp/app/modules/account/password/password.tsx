import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { savePassword, reset } from './password.reducer';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router-dom';
import { passwordRegex } from 'app/config/constants';

export const PasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);

  const newPasswordValue = Form.useWatch('newPassword', form);
  const confirmNewPasswordValue = Form.useWatch('confirmNewPassword', form);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.password.successMessage);
  const errorMessage = useAppSelector(state => state.password.errorMessage);

  const handleChangePassword = async values => {
    const response = await dispatch(savePassword(values));
    if (response.payload) {
      handleClose();
    }
  };

  // useEffect(() => {
  //   if (successMessage) {
  //     toast.success(successMessage);
  //   } else if (errorMessage) {
  //     toast.error(errorMessage);
  //   }
  //   dispatch(reset());
  // }, [successMessage, errorMessage]);

  const handleClose = () => {
    setShowModal(false);
    navigate(-1);
  };

  return (
    <Modal open={showModal} onCancel={handleClose} footer={null} maskClosable={false} width={500}>
      <Form size="large" form={form} onFinish={handleChangePassword} layout="vertical">
        <Title level={3}>Thay đổi mật khẩu</Title>
        <Row>
          <Col md={24}>
            <Form.Item rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]} label="Mật khẩu cũ" name="currentPassword">
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu mới',
                },
                {
                  pattern: passwordRegex,
                  message: 'Mật khẩu phải chứa ít nhất 1 ý tự đặc biệt, 1 chữ hoa, 1 số và có ít nhất 8 ký tự',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <PasswordStrengthBar password={newPasswordValue ?? ''} />
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng nhập xác nhận mật khẩu mới' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Không trùng khớp với mật khẩu mới'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <PasswordStrengthBar password={confirmNewPasswordValue ?? ''} />
          </Col>
        </Row>
        <Form.Item>
          <Row className="d-flex gap-3" justify="end">
            <Col>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Col>
            <Col>
              <Button
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
    </Modal>
  );
};

export default PasswordPage;
