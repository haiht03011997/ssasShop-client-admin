import * as _ from 'lodash';
import { subMenu } from '../layout/sidebar/config';

export const hasAnyPermissions = (isAdmin = false, key: string) => {
  let result = false; // Initialize result outside the forEach loop
  if (isAdmin || key === 'objective') {
    result = true;
  }
  return result;
};

export const hasPermissionsByPath = (isAdmin = false, path: string) => {
  const moduleByPath = findModuleByPath(subMenu, path);
  return hasAnyPermissions(isAdmin, moduleByPath?.key);
};

const findModuleByPath = (menu, path) => {
  for (const element of menu) {
    if (element.linkTo && path.includes(element.linkTo)) {
      return element;
    } else {
      const foundItem = _.find(element.items, x => path.includes(x.linkTo));
      if (foundItem) {
        return foundItem;
      }
    }
  }
  return null;
};

export const hasPermissions = (permissions: any[], path: string, isAdmin = false) => {
  if (permissions.length > 0) {
    const modules = _.find(permissions, o => path.includes(o.applicableObject));
    if (modules) {
      return modules.actions.reduce((acc, action) => {
        acc[action] = true;
        return acc;
      }, {});
    }
  }

  return null;
};
