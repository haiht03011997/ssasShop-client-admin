import { Button, Form, Input, Spin } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Col, Row } from 'reactstrap';
import { reset, resetPassword } from '../password-reset.reducer';
import './style.scss';
import { CloseOutlined } from '@ant-design/icons';

export const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  const resetPasswordSuccess = useAppSelector(state => state.passwordReset.resetPasswordSuccess);
  const loading = useAppSelector(state => state.passwordReset.loading);

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
      toast.success("Gửi email thành công")
      navigate('/login');
      dispatch(reset());
    }
  }, [resetPasswordSuccess])

  const handleReset = values => {
    dispatch(resetPassword(values));
  };

  return (
    <div className='form-reset-password'>
      <Spin spinning={loading} delay={500} >
        <span className='icon-closed' onClick={() => { navigate('/login'); }}><CloseOutlined /></span>
        <Form size="large" form={form} onFinish={handleReset} layout="vertical">
          <Title level={3}>Đặt lại mật khẩu</Title>
          <Row>
            <Col md={24}>
              <Form.Item rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email' }]} label="Địa chỉ email" name="email">
                <Input type="email" className="w-100" placeholder='Nhập địa chỉ email đã được cung cấp' size='large' />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Row className="action-form mt-3" justify="end">
              <Col md={24}>
                <Button disabled={loading} className="w-100 primary" htmlType="submit">
                  Gửi
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default ResetPassword;
