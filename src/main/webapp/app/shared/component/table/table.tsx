import { Table } from 'antd';
import { ITEMS_PER_PAGE, PAGE_SIZE } from 'app/shared/util/pagination.constants';
import React from 'react';

type ITableProps = {
  data: any[];
  columns: any[];
  handlePageChange?: (page: number, limit: number, filters?: any, sorter?: any) => void;
  isFetching: boolean;
  total?: number;
  noBordered?: boolean;
  tableLayout?: any;
  ref?: any;
};

const TableComponent = (props: ITableProps) => {
  return (
    <Table
      loading={props.isFetching}
      bordered={!props.noBordered}
      ref={props.ref}
      columns={props.columns}
      dataSource={props.data}
      locale={{ emptyText: 'Không có dữ liệu' }}
      pagination={{
        defaultPageSize: ITEMS_PER_PAGE, // Set the number of items per page
        showSizeChanger: true, // Allow the user to change the page size
        pageSizeOptions: PAGE_SIZE, // Define the available page sizes
        total: props.total,
      }}
      tableLayout={props.tableLayout}
      onChange={(pagination, filters, sorter) => {
        props.handlePageChange(pagination.current, pagination.pageSize, filters, sorter);
      }}
    />
  );
};

export default TableComponent;
