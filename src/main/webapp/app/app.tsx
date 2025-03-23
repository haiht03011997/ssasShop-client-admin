import 'app/config/dayjs';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Card } from 'reactstrap';

import { Layout } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import AppRoutes from 'app/routes';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './shared/error/error-boundary';
import Header from './shared/layout/header/header';
import SideBar from './shared/layout/sidebar/sidebar';
import { authorized, clearAuth, storeAccount } from './shared/reducers/authentication';
const { Content } = Layout;
const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  const dispatch = useAppDispatch();

  const token = Cookies.get('authentication-token');
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (token) {
      const tokenDecoded: any = jwtDecode(token);
      const accountInfo = {
        name: tokenDecoded.sub,
      };
      dispatch(storeAccount(accountInfo));
      dispatch(authorized());
    } else {
      dispatch(clearAuth());
    }
  }, [token]);

  return (
    <BrowserRouter basename={baseHref}>
      <div className="app-container">
        <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
        <Layout className="app-content">
          {isAuthenticated && (
            <SideBar isAuthenticated={isAuthenticated} collapsed={collapsed} setCollapsed={setCollapsed} isAdmin={account?.isAdmin} />
          )}
          <Layout>
            {isAuthenticated && (
              <Header isAuthenticated={isAuthenticated} collapsed={collapsed} setCollapsed={setCollapsed} isAdmin={account?.isAdmin} />
            )}
            <Content>
              <div className="container-fluid view-container" id="app-view-container">
                <Card className="jh-card">
                  <ErrorBoundary>
                    <AppRoutes />
                  </ErrorBoundary>
                </Card>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </BrowserRouter>
  );
};

export default App;
