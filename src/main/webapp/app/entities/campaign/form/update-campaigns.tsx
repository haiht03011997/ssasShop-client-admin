import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import { APP_TIMESTAMP_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAllEntities as getProductSelectBox } from 'app/entities/product/product.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { filterOption } from 'app/shared/util/select-filter';
import React, { useEffect } from 'react';
import { Container } from 'reactstrap';
import { createEntity, getEntity, updateEntity } from '../campaign.reducer';
import './style.scss';

type IUpdateCampaigns = {
  isOpen: boolean;
  onClose: (isReload?: boolean) => void;
  id?: string;
};

export const CampaignsUpdate = React.memo(({ isOpen, onClose, id }: IUpdateCampaigns) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const isNew = id === undefined || id === null;

  const campaignsEntity = useAppSelector(state => state.campaigns.entity);
  const productOptions = useAppSelector(state => state.products.options);
  const updating = useAppSelector(state => state.campaigns.updating);
  const updateSuccess = useAppSelector(state => state.campaigns.updateSuccess);

  const handleClose = () => {
    form.resetFields();
    onClose(updateSuccess);
  };

  useEffect(() => {
    innitData();
  }, [isOpen]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (campaignsEntity && !isNew) {
      form.setFieldsValue(
        {
          ...campaignsEntity,
          startDate: campaignsEntity.startDate && convertDateTimeToServer(campaignsEntity.startDate),
          endDate: campaignsEntity.endDate && convertDateTimeToServer(campaignsEntity.endDate)
        }
      );
    }
  }, [campaignsEntity]);

  const innitData = () => {
    dispatch(getProductSelectBox());
    // get detail
    if (isNew) {
      form.resetFields();
    } else {
      dispatch(getEntity(id));
    }
  };

  const handleSubmit = values => {
    const oldData = !isNew && campaignsEntity;
    const entity = {
      ...oldData,
      ...values,
      startDate: convertDateTimeFromServer(values.startDate),
      endDate: convertDateTimeFromServer(values.endDate),
    };
    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      onCancel={() => {
        onClose();
      }}
      footer={null}
      width={900}
    >
      <Container className="form">
        <Form size="large" form={form} onFinish={handleSubmit} initialValues={{ discounts: [{}] }} layout="vertical">
          <Title level={3}>{`${id ? 'Cập nhật thông tin' : 'Thêm mới'} chiến dịch giảm giá`}</Title>
          <Row>
            <Col md={24}>
              <Form.Item label="Tên chiến dịch" rules={[{ required: true, message: 'Hãy nhập tên chiến dịch' }]} name={'name'}>
                <Input className="w-100" size="large" placeholder="Nhập tên chiến dịch" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={11}>
              <Form.Item label="Ngày bắt đầu" rules={[{ required: true, message: 'Hãy chọn ngày bắt đầu' }]} name={'startDate'}>
                <DatePicker showTime format={APP_TIMESTAMP_FORMAT} className="w-100" size="large" placeholder="Chọn ngày bắt đầu" />
              </Form.Item>
            </Col>
            <Col md={1} />
            <Col md={12}>
              <Form.Item label="Ngày kết thúc" rules={[{ required: true, message: 'Hãy chọn ngày kết thúc' }]} name={'endDate'}>
                <DatePicker showTime format={APP_TIMESTAMP_FORMAT} className="w-100" size="large" placeholder="Chọn ngày kết thúc" />
              </Form.Item>
            </Col>
          </Row>
          <Card>
            <Form.List name="discounts">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="form-horizontal">
                      <Row className='w-100'>
                        <Col md={16}>
                          <Form.Item label="Sản phẩm"
                            rules={[
                              { required: true, message: 'Hãy chọn sản phẩm' }
                            ]}
                            name={[name, 'productId']}>
                            <Select
                              showSearch
                              filterOption={filterOption}
                              size="large"
                              options={productOptions}
                              placeholder="Chọn sản phẩm"
                            />
                          </Form.Item>
                        </Col>
                        <Col md={1} />
                        <Col md={6}>
                          <Form.Item label="Giảm giá"
                            rules={[
                              { required: true, message: 'Hãy nhập % giảm giá' },
                              { min: 1, type: 'integer', message: 'Tối thiểu phải lớn hơn 1' },
                              { max: 100, type: 'integer', message: 'Tối đa là 100' }
                            ]}
                            name={[name, 'discountRate']}>
                            <InputNumber className="w-100" size='large' placeholder="Nhập % giảm giá" min={1} addonAfter="%" />
                          </Form.Item>
                        </Col>

                      </Row>
                      {name > 0 && (
                        <MinusCircleOutlined
                          className="minus-circle-outlined"
                          onClick={() => {
                            remove(name);
                          }}
                        />
                      )}
                    </div>
                  ))}
                  {isNew && (
                    <Form.Item>
                      <div className='plus-circle-outlined w-25'
                        onClick={() => { add(); }}>
                        Bổ sung {' '}
                        <PlusCircleOutlined
                        />
                      </div>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
          </Card>
          <Form.Item>
            <Row className="action mt-3" justify="end">
              <Col>
                <Button className="primary" htmlType="submit" disabled={updating}>
                  Lưu
                </Button>
              </Col>
              <Col>
                <Button
                  className="secondary"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Hủy
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Container>
    </Modal>
  );
});

export default CampaignsUpdate;
