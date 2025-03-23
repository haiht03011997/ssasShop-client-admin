import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Col, Form, Input, Row, Spin } from 'antd';
import Title from 'antd/es/typography/Title';
import { passwordRegex } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { reset, resetPasswordFinish } from '../password-reset.reducer';
import './style.scss';

export const ResetPasswordFinish = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const resetPasswordSuccess = useAppSelector(state => state.passwordReset.resetPasswordSuccess);
  const token = searchParams.get('token');
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loading = useAppSelector(state => state.passwordReset.loading);

  const newPasswordValue = Form.useWatch('newPassword', form);
  const confirmNewPasswordValue = Form.useWatch('confirmNewPassword', form);

  useEffect(() => {
    if (!isAuthenticated) {
      // Add a class to the body when the user logs in
      document.body.classList.add('un-authorized');

      // Optionally, you can remove the class when the component unmounts or when the user logs out
      return () => {
        document.body.classList.remove('un-authorized');
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (resetPasswordSuccess) {
      toast.success("Cập nhật mật khẩu thành công");
      dispatch(reset());
      handleClose();
    }
  }, [resetPasswordSuccess]);

  const handleChangePassword = values => {
    dispatch(resetPasswordFinish({ newPassword: values.newPassword, token }));
  };

  const handleClose = () => {
    navigate("/login");
  };

  return (
    <div className='form-reset-password-finish'>
      <Spin spinning={loading} delay={500} >
        <Form size="large" form={form} onFinish={handleChangePassword} layout="vertical">
          <Title level={3}>Thay đổi mật khẩu</Title>
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
                <Button className='primary' size='large' htmlType="submit">
                  Lưu
                </Button>
              </Col>
              <Col>
                <Button
                  className='secondary'
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
      </Spin>
    </div>
  );
};

export default ResetPasswordFinish;
