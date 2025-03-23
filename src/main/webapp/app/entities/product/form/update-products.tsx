import { Button, Col, Form, Input, InputNumber, Modal, Row, Upload, Image, UploadFile, Select } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PlusOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useMemo, useState } from 'react';
import { Container } from 'reactstrap';
import { createEntity, getEntity, updateEntity } from '../product.reducer';
import TextArea from 'antd/es/input/TextArea';
import { formatCurrencyVND, getBase64, parseCurrencyVND } from 'app/shared/util/help';
import './style.scss'
import { getAllEntities } from 'app/entities/category/category.reducer';
import { filterOption } from 'app/shared/util/select-filter';
type IUpdateProducts = {
  isOpen: boolean;
  onClose: (isReload?: boolean) => void;
  id?: string;
};

export const ProductsUpdate = React.memo(({ isOpen, onClose, id }: IUpdateProducts) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const isNew = id === undefined || id === null;

  const productsEntity = useAppSelector(state => state.products.entity);
  const updating = useAppSelector(state => state.products.updating);
  const updateSuccess = useAppSelector(state => state.products.updateSuccess);
  const categoriesOption = useAppSelector(state => state.categories.options);

  // initialize state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleClose = () => {
    form.resetFields();
    onClose(updateSuccess);
  };

  // Custom toolbar để thêm nút Upload ảnh
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
      ],
    },
  }), []);

  useEffect(() => {
    innitData();
  }, [isOpen]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (productsEntity && !isNew) {
      form.setFieldsValue(productsEntity);
    }
  }, [productsEntity]);

  const innitData = () => {
    dispatch(getAllEntities())
    // get detail
    if (isNew) {
      form.resetFields();
    } else {
      dispatch(getEntity(id));
    }
  };

  const handleSubmit = values => {
    const formData = new FormData();
    const oldData = !isNew && productsEntity;
    const entity = {
      ...oldData,
      ...values,
    };

    // Thêm các trường vào FormData
    for (const key in entity) {
      if (Object.prototype.hasOwnProperty.call(entity, key)) {
        formData.append(key, entity[key]); // Thêm các trường khác
      }
    }

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const handlePreviewImage = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as any);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChangeImage = ({ fileList }) => {
    // Lưu giá trị vào Form.Item bằng setFieldsValue
    form.setFieldsValue({ file: fileList[0].originFileObj });
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
      <Container className="form product-form">
        <Form size="large" form={form} onFinish={handleSubmit} layout="vertical">
          <Title level={3}>{`${id ? 'Cập nhật thông tin' : 'Thêm mới'} sản phẩm`}</Title>
          <Row>
            <Col md={24}>
              <Form.Item label="Tên sản phẩm" rules={[{ required: true, message: 'Hãy nhập tên sản phẩm' }]} name={'name'}>
                <Input className="w-100" size="large" placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={11}>
              <Form.Item label="Giá tiền" rules={[{ required: true, message: 'Hãy nhập giá' }]} name={'price'}>
                <InputNumber className="w-100" formatter={formatCurrencyVND}
                  parser={parseCurrencyVND} min={0} size="large" placeholder="Nhập giá" addonAfter="Vnđ" />
              </Form.Item>
            </Col>
            <Col md={1} />
            <Col md={12}>
              <Form.Item label="Số lượng" rules={[{ required: true, message: 'Hãy nhập số lượng' }]} name={'stock'}>
                <InputNumber className="w-100" min={0} size="large" placeholder="Nhập số lượng" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item label="Loại dịch vụ" rules={[{ required: true, message: 'Hãy chọn loại dịch vụ' }]} name={'categoryId'}>
                <Select filterOption={filterOption} options={categoriesOption} className="w-100" size="large" placeholder="Chọn loại dịch vụ giá" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item
                label="Mô tả sản phẩm"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <ReactQuill theme="snow" modules={modules} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Tải lên ảnh sản phẩm"
            name="file"
            rules={[{ required: true, message: "Vui lòng tải lên ảnh!" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false} // Ngăn Upload gửi request
              onPreview={handlePreviewImage}
              onChange={handleChangeImage} // Cập nhật Form
            >
              <div className="d-flex justify-content-center align-items-center gap-2">
                <PlusOutlined />
                <div>Upload</div>
              </div>
            </Upload>
            {previewImage && (
              <Image
                prefixCls="d-flex justify-content-center"
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
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

export default ProductsUpdate;
