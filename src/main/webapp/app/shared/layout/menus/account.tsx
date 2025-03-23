import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';

import { NavDropdown } from './menu-components';

const accountMenuItemsAuthenticated = () => (
  <>
    <MenuItem icon="lock" to="/account/password" data-cy="passwordItem">
      Đổi mật khẩu
    </MenuItem>
    <MenuItem icon="sign-out-alt" to="/logout" data-cy="logout">
      Đăng xuất
    </MenuItem>
  </>
);

type IAccountMenu = {
  isAuthenticated: boolean;
  accountName: string;
};

export const AccountMenu = (props: IAccountMenu) => (
  <NavDropdown icon="user" name={props.accountName} id="account-menu" data-cy="accountMenu">
    {props.isAuthenticated && accountMenuItemsAuthenticated()}
  </NavDropdown>
);

export default AccountMenu;
