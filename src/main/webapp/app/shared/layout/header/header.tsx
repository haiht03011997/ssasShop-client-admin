import './header.scss';

import React from 'react';
import LoadingBar from 'react-redux-loading-bar';
import { Nav, Navbar } from 'reactstrap';

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAppSelector } from 'app/config/store';
import { AccountMenu } from '../menus';
import { Brand } from './header-components';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Header = ({ isAuthenticated, isAdmin, collapsed, setCollapsed }) => {
  const account = useAppSelector(state => state.authentication.account);
  return (
    <div id="app-header">
      <LoadingBar className="loading-bar" />
      <div className="d-flex align-items-center justify-content-between">
        {isAuthenticated && (
          <div>
            {isAdmin &&
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                size="large"
              />
            }
          </div>
        )}
        <Navbar data-cy="navbar" expand="md" className="jh-navbar">
          <Nav id="header-tabs" className="ms-auto" navbar>
            <AccountMenu isAuthenticated={isAuthenticated} accountName={account.userName} />
          </Nav>
        </Navbar>
      </div>
    </div>
  );
};

export default Header;
