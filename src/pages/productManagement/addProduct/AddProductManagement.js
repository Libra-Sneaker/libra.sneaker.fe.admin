import React, { useEffect, useState } from "react";
import styles from "./AddProductManagement.module.css";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import ModalColor from "./ModalColor";
import ModalSize from "./ModalSize";
import { useNavigate } from "react-router";
import { BrandManagementApi } from "../../../api/admin/brandManagement/BrandManagementApi";
import { TypeOfShoeManagementApi } from "../../../api/admin/typeOfShoeManagement/TypeOfShoeManagementApi";
import { MaterialManagementApi } from "../../../api/admin/materialManagement/MaterialManagementApi";
import { ProductManagementApi } from "../../../api/admin/productManagement/ProductManagementApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FileUploadApi } from "../../../api/admin/fileUpload/FileUploadApi";

const AddProductManagement = () => {
  const [productName, setProductName] = useState("");
  const [brandOptions, setBrandOptions] = useState([]);
  const [typeOfShoeOptions, setTypeOfShoeOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const [isModalOpenSize, setIsModalOpenSize] = useState(false);

  const showModalSize = () => {
    setIsModalOpenSize(true);
  };

  const handleModalCloseSize = () => {
    setIsModalOpenSize(false);
  };

  const [form] = Form.useForm();

  const handleBack = () => {
    navigate("/product-management");
  };

  const [listColorSelected, setListColorSelected] = useState([]);
  const [listSizeSelected, setListSizeSelected] = useState([]);
  const [listProductDetail, setListProductDetail] = useState([]);

  const genProductDetail = () => {
    const productDetails = [];

    listColorSelected.forEach((color) => {
      listSizeSelected.forEach((size) => {
        const detail = {
          colorId: color.id,
          colorName: color.name,
          sizeId: size.id,
          sizeName: size.name,
          price: 100,
          quantity: 1,
        };

        productDetails.push(detail);
      });
    });
    setListProductDetail(productDetails);
    console.log(productDetails);
  };

  const handleDelete = (record) => {
    setListProductDetail((prevDetails) =>
      prevDetails.filter(
        (detail) =>
          detail.colorId !== record.colorId || detail.sizeId !== record.sizeId
      )
    );
  };
  console.log(listProductDetail);

  useEffect(() => {
    console.log("listProductDetail:");

    console.log(listProductDetail);

    genProductDetail();
  }, [listColorSelected, listSizeSelected]);

  const fetchBrandOptions = async () => {
    try {
      const response = await BrandManagementApi.getBrands();
      if (response && response.data) {
        setBrandOptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchTypeOfShoeOptions = async () => {
    try {
      const response = await TypeOfShoeManagementApi.getTypeOfShoe();
      if (response && response.data) {
        setTypeOfShoeOptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchMaterialOptions = async () => {
    try {
      const response = await MaterialManagementApi.getMaterial();
      if (response && response.data) {
        setMaterialOptions(response.data); // Set the fetched brands into brandOptions state
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrandOptions();
    fetchTypeOfShoeOptions();
    fetchMaterialOptions();
  }, []);

  // lấy dữ liệu từ ô productName:
  const handleProductName = (e) => {
    setProductName(e.target.value);
    console.log("Tên sản phẩm :", e.target.value);
  };

  // lấy dữ liệu từ �� brand:
  const handleBrandChange = (value) => {
    const selectedBrand = brandOptions.find((brand) => brand.id === value);
    if (selectedBrand) {
      console.log("Tên thương hiệu được chọn:", selectedBrand.name);
    }
  };

  // lấy dữ liệu từ �� type:
  const handleTypeOfShoeChange = (value) => {
    const selectedType = typeOfShoeOptions.find((type) => type.id === value);
    if (selectedType) {
      console.log("Loại giày được chọn:", selectedType.name);
    }
  };

  // lấy dữ liệu từ �� material:
  const handleMaterialChange = (value) => {
    const selectedMaterial = materialOptions.find(
      (material) => material.id === value
    );
    if (selectedMaterial) {
      console.log("Loại chất liệu được chọn:", selectedMaterial.name);
    }
  };

  //
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    console.log("description:", e.target.value);
  };

  const handleListProduct = () => {
    const newProduct = {
      name: productName,
    };
  };

  const [checkedRows, setCheckedRows] = useState({}); // Track which rows are checked
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // Toggle checkbox selection and enable editing for the selected row
  const handleCheckboxChange = (record) => {
    setCheckedRows((prev) => ({
      ...prev,
      [record.colorId + record.sizeId]: !prev[record.colorId + record.sizeId],
    }));
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAllChecked(isChecked);

    // Update checkedRows to reflect the selectAllChecked state
    const newCheckedRows = {};
    listProductDetail.forEach((item) => {
      newCheckedRows[item.colorId + item.sizeId] = isChecked;
    });
    setCheckedRows(newCheckedRows);
  };

  const handleInputChange = (e, record, field) => {
    const { value } = e.target;
    setListProductDetail((prev) =>
      prev.map((item) =>
        item.colorId === record.colorId && item.sizeId === record.sizeId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  //
  const columns = [
    {
      title: (
        <Checkbox onChange={handleSelectAllChange} checked={selectAllChecked} />
      ),
      key: "checkBox",
      render: (_, record) => (
        <Checkbox
          onChange={() => handleCheckboxChange(record)}
          checked={!!checkedRows[record.colorId + record.sizeId]}
        />
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "urlImg",
      key: "urlImg",
      render: (value, record) => (
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          action="/upload" // Your upload URL
          maxCount={1}
          onChange={({ file }) => handleFileChange(file, record)}
        >
          {value ? (
            <img
              src={value} // Hiển thị ảnh đã tải lên nếu có
              alt="avatar"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <span>{productName}</span>,
    },
    {
      title: "Size",
      dataIndex: "sizeName",
      key: "size",
    },
    {
      title: "Màu sắc",
      dataIndex: "colorName",
      key: "color",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_, record) =>
        checkedRows[record.colorId + record.sizeId] ? (
          <Input
            value={record.price}
            onChange={(e) => handleInputChange(e, record, "price")}
            type="number"
          />
        ) : (
          <span>{record.price}</span>
        ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) =>
        checkedRows[record.colorId + record.sizeId] ? (
          <Input
            value={record.quantity}
            onChange={(e) => handleInputChange(e, record, "quantity")}
            type="number"
          />
        ) : (
          <span>{record.quantity}</span>
        ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleDelete(record)}>
            <Button>
              {<FontAwesomeIcon icon={faTrash} style={{ color: "red" }} />}
            </Button>
          </a>
        </Space>
      ),
    },
  ];

  const handleFileChange = (file, record) => {
    setListProductDetail((prevList) =>
      prevList.map((item) =>
        item.colorId === record.colorId && item.sizeId === record.sizeId
          ? { ...item, file: file.originFileObj }
          : item
      )
    );
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("multipartFile", file);
  
    try {
      const response = await FileUploadApi.uploadFileImage(formData);
      return response.data; // Return image URL directly from response data
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Rethrow error to handle in handleAddProduct
    }
  };
  
  const handleAddProduct = async () => {
    try {
       // Check if essential fields are filled
       if (!productName || !form.getFieldValue("brand") || !form.getFieldValue("material") || !form.getFieldValue("category") || !description) {
        message.error("Vui lòng điền đầy đủ thông tin sản phẩm.");
        return;
      }

      // Check if any color and size details are selected
      if (listProductDetail.length === 0) {
        message.error("Vui lòng chọn ít nhất một màu sắc và kích cỡ cho sản phẩm.");
        return;
      }

      // Check if each product detail has necessary fields
      const incompleteDetails = listProductDetail.some(detail => 
        !detail.sizeId || !detail.colorId || detail.price === undefined || detail.quantity === undefined
      );

      if (incompleteDetails) {
        message.error("Vui lòng điền đầy đủ thông tin chi tiết sản phẩm.");
        return;
      }
      // Wait for all file uploads to complete and update `urlImg`
      const updatedDetails = await Promise.all(
        listProductDetail.map(async (product) => {
          if (product.file) {
            const urlImg = await handleUpload(product.file); // Upload and get URL
            return { ...product, urlImg: urlImg }; // Set `urlImg` in product details
          }
          return product; // No file, return unchanged
        })
      );
  
      // Prepare product data after all uploads are done
      const productData = {
        name: productName,
        brandId: form.getFieldValue("brand"),
        materialId: form.getFieldValue("material"),
        typeId: form.getFieldValue("category"),
        description: description,
        details: updatedDetails.map((detail) => ({
          sizeId: detail.sizeId,
          colorId: detail.colorId,
          price: detail.price,
          quantity: detail.quantity,
          urlImg: detail.urlImg, // Use updated urlImg
        })),
      };
  
      console.log("Thông tin sản phẩm:", productData);
  
      // Create product after uploads are complete
      await ProductManagementApi.create(productData);
  
      message.success("Sản phẩm được thêm thành công!");
  
      // Clear form and reset states after success
      form.resetFields();
      setProductName("");
      setDescription("");
      setListProductDetail([]);
  
      // Navigate back to the product management page
      navigate("/product-management");
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Có lỗi xảy ra khi thêm sản phẩm.");
    }
  };
  

  useEffect(() => {}, []);

  return (
    <div className={styles.addProductContainer}>
      <h2>Sản phẩm &gt; Thêm sản phẩm</h2>
      <Button
        type="default"
        onClick={handleBack}
        style={{ marginBottom: "16px" }}
      >
        Quay lại
      </Button>

      <div className={styles.formProductContainer}>
        <div style={{ maxWidth: 800, margin: "auto", padding: "2rem" }}>
          <h2 style={{ textAlign: "center" }}>Thông tin sản phẩm</h2>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="productName"
                  label="Tên sản phẩm"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên sản phẩm"
                    value={productName}
                    onChange={handleProductName}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="brand"
                  label="Thương hiệu"
                  rules={[
                    { required: true, message: "Vui lòng chọn thương hiệu" },
                  ]}
                >
                  <Select
                    placeholder="Chọn thương hiệu"
                    onChange={handleBrandChange}
                  >
                    {brandOptions.map((brand) => (
                      <Select.Option key={brand.id} value={brand.id}>
                        {brand.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                  ]}
                >
                  <Select
                    placeholder="Chọn danh mục"
                    onChange={handleTypeOfShoeChange}
                  >
                    {typeOfShoeOptions.map((type) => (
                      <Select.Option key={type.id} value={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="material"
                  label="Chất liệu"
                  rules={[
                    { required: true, message: "Vui lòng chọn chất liệu" },
                  ]}
                >
                  <Select
                    placeholder="Chọn chất liệu"
                    onChange={handleMaterialChange}
                  >
                    {materialOptions.map((material) => (
                      <Select.Option key={material.id} value={material.id}>
                        {material.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}></Col>
              <Col span={24}>
                <Form.Item name="description" label="Mô tả sản phẩm">
                  <TextArea
                    rows={4}
                    placeholder="Nhập mô tả sản phẩm"
                    onChange={handleDescriptionChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      <div className={styles.formProductDetailContainer}>
        <div style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
          <h2 style={{ textAlign: "center" }}>Màu sắc & kích cỡ</h2>

          <div>
            <Row align="middle">
              <span>
                Màu sắc <span style={{ color: "red" }}>*</span>:
              </span>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: "orange",
                  borderColor: "orange",
                  margin: "10px",
                }}
                onClick={showModal} // Hiển thị modal khi bấm nút
              />

              {listColorSelected &&
                listColorSelected.map((color) => {
                  return (
                    <Button style={{ marginRight: 5 }} key={color.id}>
                      {color.name}
                    </Button>
                  );
                })}

              <ModalColor
                setListColorSelected={setListColorSelected}
                isModalOpen={isModalOpen}
                handleCancel={handleModalClose}
              />
            </Row>

            <Row align="middle">
              <span>
                Kích cỡ <span style={{ color: "red" }}>*</span>:
              </span>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: "orange",
                  borderColor: "orange",
                  margin: "15px",
                }}
                onClick={showModalSize}
              />

              {listSizeSelected &&
                listSizeSelected
                  .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name in ascending order
                  .map((size) => (
                    <Button style={{ marginRight: 5 }} key={size.id}>
                      {size.name}
                    </Button>
                  ))}

              <ModalSize
                setListSizeSelected={setListSizeSelected}
                isModalOpen={isModalOpenSize}
                handleCancel={handleModalCloseSize}
              />
            </Row>
          </div>
        </div>
      </div>

      <div className={styles.tableProductDetail}>
        <Table
          columns={columns}
          dataSource={listProductDetail}
          rowKey={(record) => record.colorId + record.sizeId}
        />
      </div>

      <div className={styles.btnAddProduct}>
      <Popconfirm
        title="Bạn có chắc muốn thêm sản phẩm mới?"
        onConfirm={handleAddProduct}
        onCancel={() => console.log("Thêm sản phẩm bị hủy")}
        okText="Đúng"
        cancelText="Hủy"
      >
        <Button type="primary">Thêm mới</Button>
      </Popconfirm>
    </div>
    </div>
  );
};

export default AddProductManagement;
