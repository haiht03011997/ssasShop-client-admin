import { displayDefaultDateTime } from "app/shared/util/date-utils";

export const columns = [
  {
    title: 'Tên chiến dịch',
    key: 'name',
    sorter: true,
    dataIndex: 'name',
  },
  {
    title: 'Sản phẩm',
    key: 'product',
    dataIndex: 'product',
  },
  {
    title: 'Ngày bắt đầu',
    key: 'startDate',
    dataIndex: 'startDate',
    render: item => item && displayDefaultDateTime(item)
  },
  {
    title: 'Ngày kết thúc',
    key: 'endDate',
    dataIndex: 'endDate',
    render: item => item && displayDefaultDateTime(item)
  },
];
