import { Layout, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Brand } from '../header/header-components';
import { subMenu } from './config';
import './sidebar.scss';
const { Sider } = Layout;

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SideBar = (props: IHeaderProps) => {
  const renderSubMenu = sub => {
    if (sub.linkTo) {
      return (
        <Menu.Item icon={sub.icon} key={`${sub.key}`}>
          <Link className="item-router" to={sub.linkTo}>
            {sub.title}
          </Link>
        </Menu.Item>
      );
    }

    return (
      <Menu.SubMenu icon={sub.icon} key={sub.key} title={sub.title}>
        {sub.items?.map(subItem => {
          return (
            <Menu.Item key={`${sub.key}_${subItem.key}`}>
              <Link className="item-router" to={subItem.linkTo}>
                {subItem.title}
              </Link>
            </Menu.Item>
          );
        })}
      </Menu.SubMenu>
    );
  };
  return (
    <Sider width={250} className="menu" trigger={null} collapsible collapsed={props.collapsed}>
      <Brand />
      <Menu theme="dark" mode="inline">
        {subMenu.map(sub => renderSubMenu(sub))}
      </Menu>
    </Sider>
  );
};

export default SideBar;
