import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import React, { useCallback, useEffect, useState } from 'react';
import { getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Space, Switch, Tooltip } from 'antd';
import Title from 'antd/es/typography/Title';
import ModalConfirmComponent from 'app/shared/component/modal/confirm';
import TableComponent from 'app/shared/component/table/table';
import { activatedAccount, deleteEntity, getEntities } from '../account.reducer';
import { columns } from './config';
import { OrderByType } from 'app/shared/model/enum/order-type.enum';
import UserUpdate from '../form/update-account';

const { Search } = Input;

export const User = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(pageLocation.search);

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'lastModifiedDate', DESC), pageLocation.search),
  );

  const accountsList = useAppSelector(state => state.accounts.entities);
  const loading = useAppSelector(state => state.accounts.loading);
  const totalItems = useAppSelector(state => state.accounts.totalItems);

  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);
  const [isOpenModalForm, setOpenModalForm] = useState(false);
  const [searchText, setSearchText] = useState();
  const [idSelected, setIdSelected] = useState(null);

  const columnConfig = [
    ...columns,
    {
      title: 'Tình trạng',
      key: 'activated',
      render: item => <Switch onChange={e => { handleActivatedAccount(item.id, e) }} value={item.activated} />
    },
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
                  handleOpenModal(item.id);
                }}
              />
            </Tooltip>
          </span>
          <span className="action-delete">
            <Tooltip title="Xóa">
              <FontAwesomeIcon
                onClick={() => {
                  handleWarningDeleteItem(item.id);
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

  const handleOpenModal = (id = null) => {
    setOpenModalForm(true);
    setIdSelected(id);
  };

  const handleCloseModal = useCallback(
    isReload => {
      setOpenModalForm(false);
      setIdSelected(null);
      if (isReload) {
        getAllEntities();
      }
    },
    [isOpenModalForm],
  );

  const handleWarningDeleteItem = (id: number) => {
    setVisibleConfirmDelete(true);
    setIdSelected(id);
  };

  const handleConfirmDelete = () => {
    if (idSelected) {
      dispatch(deleteEntity(idSelected))
        .then(() => {
          getAllEntities();
        })
        .finally(() => {
          setVisibleConfirmDelete(false);
        });
    }
  };

  const handleActivatedAccount = (id, activated) => {
    const payload = {
      id,
      activated
    }
    dispatch(activatedAccount(payload))
  }

  return (
    <Container className="view">
      <Title level={3}>Danh sách người dùng</Title>
      <div className="table">
        <div className="header">
          <Space className="search">
            <Search allowClear placeholder="Nhập giá trị tìm kiếm" onSearch={handleFreeTextSearchQuery} enterButton />
          </Space>
          {/* <Space>
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
          </Space> */}
        </div>
        <TableComponent
          data={accountsList.map(x => ({ ...x, key: x.id }))}
          total={totalItems}
          isFetching={loading}
          columns={columnConfig}
          handlePageChange={(pageNumber: number, size: number, search: any, sorter: any) => {
            handleChange(pageNumber, size, sorter);
          }}
        />
      </div>
      <UserUpdate isOpen={isOpenModalForm} id={idSelected} onClose={handleCloseModal} />
      <ModalConfirmComponent
        visible={visibleConfirmDelete}
        onCancel={() => {
          setVisibleConfirmDelete(false);
        }}
        onConfirm={handleConfirmDelete}
        title="Bạn có muốn xóa nhân sự"
      />
    </Container>
  );
};

export default User;
