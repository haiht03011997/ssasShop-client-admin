import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import React, { useCallback, useEffect, useState } from 'react';
import { getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Space, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import ModalConfirmComponent from 'app/shared/component/modal/confirm';
import TableComponent from 'app/shared/component/table/table';
import { deleteEntity, getEntities } from '../category.reducer';
import { columns } from './config';
import { OrderByType } from 'app/shared/model/enum/order-type.enum';
import CategoriesUpdate from '../form/update-categories';

const { Search } = Input;

export const Categories = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(pageLocation.search);

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'lastModifiedDate', DESC), pageLocation.search),
  );

  const categoriesList = useAppSelector(state => state.categories.entities);
  const loading = useAppSelector(state => state.categories.loading);
  const totalItems = useAppSelector(state => state.categories.totalItems);

  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);
  const [isOpenModalForm, setOpenModalForm] = useState(false);
  const [searchText, setSearchText] = useState();
  const [recordSelected, setRecordSelected] = useState(null);

  const columnConfig = [
    ...columns,
    {
      title: 'Hành động',
      key: 'Action',
      fixed: 'right',
      width: 80,
      render: (item: any) => (
        <div className="action">
          <span className="action-edit">
            <Tooltip title="Sửa">
              <FontAwesomeIcon
                icon="pencil-alt"
                onClick={() => {
                  handleOpenModal(item);
                }}
              />
            </Tooltip>
          </span>
          <span className="action-delete">
            <Tooltip title="Xóa">
              <FontAwesomeIcon
                onClick={() => {
                  handleWarningDeleteItem(item);
                }}
                icon="trash"
              />
            </Tooltip>
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllEntities();
  }, [paginationState]);

  const getAllEntities = (value?: string) => {
    dispatch(
      getEntities({
        searchText: value ?? searchText,
        page: value ? 1 : paginationState.activePage,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const handleChange = (pageNumber: number, size: number, sorter: any) => {
    const { order, sort } = paginationState;
    setPaginationState({
      ...paginationState,
      order: Object.keys(sorter).length !== 0 ? (sorter.order && OrderByType[sorter.order] === OrderByType.descend ? DESC : ASC) : order,
      sort: Object.keys(sorter).length !== 0 ? sorter.columnKey : sort,
      activePage: pageNumber,
      itemsPerPage: size,
    });
  };

  const handleFreeTextSearchQuery = query => {
    setSearchText(query);
    getAllEntities(query);
  };

  const handleOpenModal = (record = null) => {
    setOpenModalForm(true);
    setRecordSelected(record);
  };

  const handleCloseModal = useCallback(
    isReload => {
      setOpenModalForm(false);
      setRecordSelected(null);
      if (isReload) {
        getAllEntities();
      }
    },
    [isOpenModalForm],
  );

  const handleWarningDeleteItem = (record) => {
    setVisibleConfirmDelete(true);
    setRecordSelected(record);
  };

  const handleConfirmDelete = () => {
    if (recordSelected) {
      dispatch(deleteEntity(recordSelected.id))
        .then(() => {
          getAllEntities();
        })
        .finally(() => {
          setVisibleConfirmDelete(false);
        });
    }
  };

  return (
    <Container className="view">
      <Title level={3}>Danh sách loại dịch vụ</Title>
      <div className="table">
        <div className="header">
          <Space className="search">
            <Search allowClear placeholder="Nhập giá trị tìm kiếm" onSearch={handleFreeTextSearchQuery} enterButton />
          </Space>
          <Space>
            <Button
              className="filter"
              type="primary"
              onClick={() => {
                handleOpenModal();
              }}
              icon={<PlusOutlined />}
            >
              Thêm mới
            </Button>
          </Space>
        </div>
        <TableComponent
          data={categoriesList}
          total={totalItems}
          isFetching={loading}
          columns={columnConfig}
          handlePageChange={(pageNumber: number, size: number, search: any, sorter: any) => {
            handleChange(pageNumber, size, sorter);
          }}
        />
      </div>
      <CategoriesUpdate isOpen={isOpenModalForm} id={recordSelected?.id} onClose={handleCloseModal} />
      <ModalConfirmComponent
        visible={visibleConfirmDelete}
        onCancel={() => {
          setVisibleConfirmDelete(false);
        }}
        onConfirm={handleConfirmDelete}
        title={`Bạn có muốn xóa loại dịch vụ ${recordSelected?.name}`}
      />
    </Container>
  );
};

export default Categories;
