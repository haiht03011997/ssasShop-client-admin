import { UserOutlined, AppstoreOutlined, RocketOutlined, FolderOutlined, ClockCircleOutlined, TagsOutlined } from '@ant-design/icons';
import React from 'react';

export const subMenu = [
  {
    title: 'Tài khoản',
    key: 'accounts',
    linkTo: '/accounts',
    icon: <UserOutlined />,
  },
  {
    title: 'Sản phẩm',
    key: 'products',
    linkTo: '/products',
    icon: <AppstoreOutlined />,
  },
  {
    title: 'Chiến dịch',
    key: 'campaigns',
    linkTo: '/campaigns',
    icon: <RocketOutlined />,
  },
  {
    title: 'Danh mục dùng chung',
    key: 'shared',
    icon: <FolderOutlined />,
    items: [
      {
        title: 'Danh mục thời hạn dịch vụ',
        key: 'duration',
        linkTo: '/durations',
        icon: <ClockCircleOutlined />,
      },
      {
        title: 'Danh mục loại dịch vụ',
        key: 'categories',
        linkTo: '/categories',
        icon: <TagsOutlined />,
      },
    ],
  },
];
