import { formatCurrencyVND } from "app/shared/util/help";

export const columns = [
  {
    title: 'Tên',
    key: 'name',
    sorter: true,
    dataIndex: 'name',
  },
  {
    title: 'Loại dịch vụ',
    key: 'categoryName',
    dataIndex: 'categoryName',
  },
  {
    title: 'Số tiền',
    key: 'price',
    dataIndex: 'price',
    render: item => formatCurrencyVND(item)
  },
  {
    title: 'Số lượng',
    key: 'stock',
    dataIndex: 'stock',
  },
];
