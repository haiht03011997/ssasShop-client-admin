import './style.scss';

import { Button, Checkbox, Form, Input, Spin } from 'antd';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { auth } from 'app/shared/reducers/authentication';
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

export const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loading = useAppSelector(state => state.authentication.loading);

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

  const handleLogin = values => {
    const { username, password, rememberMe = false } = values;
    dispatch(auth(username, password, rememberMe));
  };

  const handleForgotPassWord = () => {
    navigate('/account/reset/request');
  };

  if (isAuthenticated) {
    return <Navigate to={"/objective"} replace />;
  }

  return (
    <div className="form-login">
      <Spin spinning={loading} delay={300}>
        <Form size="large" form={form} onFinish={handleLogin} layout="vertical">
          <Title level={3}>Đăng nhập</Title>
          <Row>
            <Col md={24}>
              <Form.Item rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]} label="Tên đăng nhập" name="username">
                <Input type="text" className="w-100" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]} label="Mật khẩu" name="password">
                <Input.Password className="w-100" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Item name="rememberMe" valuePropName="checked">
                <Checkbox>Ghi nhớ</Checkbox>
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item>
                <span
                  onClick={() => {
                    handleForgotPassWord();
                  }}
                  className="forgot"
                >
                  Quên mật khẩu?
                </span>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Row className="action-form" justify="end">
              <Col md={24}>
                <Button className="w-100 primary" htmlType="submit">
                  Đăng nhập
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default Login;
