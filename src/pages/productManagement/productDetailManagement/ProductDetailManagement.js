import React, { useEffect, useState } from "react";
import styles from "./ProductDetailManagement.module.css";
import {
  Button,
  Checkbox,
  Input,
  message,
  Pagination,
  Select,
  Slider,
  Spin,
  Table,
  Upload,
} from "antd";
import { useNavigate, useParams } from "react-router";
import { BrandManagementApi } from "../../../api/admin/brandManagement/BrandManagementApi";
import { TypeOfShoeManagementApi } from "../../../api/admin/typeOfShoeManagement/TypeOfShoeManagementApi";
import { ColorManagementApi } from "../../../api/admin/colorManagemnet/ColorManagementApi";
import { MaterialManagementApi } from "../../../api/admin/materialManagement/MaterialManagementApi";
import { SizeManagementApi } from "../../../api/admin/sizeManagement/SizeManagementApi";
import { ProductDetailManagementApi } from "../../../api/admin/productDetailManagement/productDetailManagementApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import ModalProductDetail from "./ModalProductDetail";
import { FileUploadApi } from "../../../api/admin/fileUpload/FileUploadApi";

const ProductDetailManagement = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // Destructure the productId from the URL

  useEffect(() => {
    console.log("Product ID:", productId); // Log the productId or use it to fetch product details
    // Fetch the product details using the productId
  }, [productId]);

  const handleBack = () => {
    navigate("/product-management"); // Quay lại trang trước đó
  };

  const [brandOptions, setBrandOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  // Thêm useState để lưu các lựa chọn option
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [listProductDetails, setListProductDetails] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const getBrand = async () => {
    try {
      const response = await BrandManagementApi.getBrands();
      setBrandOptions(
        response.data.map((brand) => ({
          value: brand.id,
          label: brand.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch brands", error);
    }
  };

  const getProductType = async () => {
    try {
      const response = await TypeOfShoeManagementApi.getTypeOfShoe();
      setTypeOptions(
        response.data.map((typeOfShoe) => ({
          value: typeOfShoe.id,
          label: typeOfShoe.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch type of shoe", error);
    }
  };

  const getColor = async () => {
    try {
      const response = await ColorManagementApi.getColor();
      setColorOptions(
        response.data.map((color) => ({
          value: color.id,
          label: color.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch type of shoe", error);
    }
  };

  const getMaterial = async () => {
    try {
      const response = await MaterialManagementApi.getMaterial();
      setMaterialOptions(
        response.data.map((material) => ({
          value: material.id,
          label: material.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch material", error);
    }
  };

  const getSize = async () => {
    try {
      const response = await SizeManagementApi.getSize();
      setSizeOptions(
        response.data.map((size) => ({
          value: size.id,
          label: size.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch size", error);
    }
  };

  useEffect(() => {
    getProductType();
    getBrand();
    getColor();
    getMaterial();
    getSize();
  }, []);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
    console.log("Input value:", event.target.value);
  };

  // Hàm để log ra ID khi thay đổi lựa chọn
  const handleSelectChange = (type, value) => {
    switch (type) {
      case "brand":
        setSelectedBrand(value);
        console.log("Selected Brand ID:", value);
        break;
      case "type":
        setSelectedType(value);
        console.log("Selected Type ID:", value);
        break;
      case "material":
        setSelectedMaterial(value);
        console.log("Selected Material ID:", value);
        break;
      case "color":
        setSelectedColor(value);
        console.log("Selected Color ID:", value);
        break;
      case "size":
        setSelectedSize(value);
        console.log("Selected Size ID:", value);
        break;
      case "status":
        setSelectedStatus(value);
        console.log("Selected Status ID:", value);
        break;
      default:
        break;
    }
  };

  const [listSelectRow, setListSelectRow] = useState([]); // Track selected rows as an array of productDetailId
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAllChecked(isChecked);

    // Update listSelectRow based on whether select all is checked
    if (isChecked) {
      setListSelectRow(listProductDetails.map((item) => item.productDetailId)); // Select all
    } else {
      setListSelectRow([]); // Deselect all
    }
  };

  const handleCheckboxChange = (record) => {
    const productDetailId = record.productDetailId;
    setListSelectRow(
      (prev) =>
        prev.includes(productDetailId)
          ? prev.filter((id) => id !== productDetailId) // Deselect if already selected
          : [...prev, productDetailId] // Select if not already selected
    );
  };

  const handleEditInputChange = (value, record, field) => {
    setListProductDetails((prev) =>
      prev.map((item) =>
        item.productDetailId === record.productDetailId
          ? { ...item, [field]: value } // Cập nhật giá trị trường
          : item
      )
    );
  };

  // save list
  const handleSaveListProductDetails = async () => {
    // Upload files and attach the URLs
    const updatedDetails = await Promise.all(
      listProductDetails.map(async (product) => {
        if (product.file) {
          const urlImg = await handleUpload(product.file);
          return { ...product, urlImg }; // Attach the uploaded image URL
        }
        return product;
      })
    );

    // Prepare the data to send to the API
    const productDetailsToSave = updatedDetails.map((item) => ({
      id: item.productDetailId,
      price: item.price,
      quantity: item.quantity,
      status: item.status,
      urlImg: item.urlImg, // Updated image URL
    }));

    // Check if there is data to update
    if (productDetailsToSave.length === 0) {
      message.warning("Không có dữ liệu để cập nhật!");
      return;
    }

    // Send the updated list to the API
    try {
      const response = await ProductDetailManagementApi.saveListProductDetail(
        productDetailsToSave
      );
      if (response && response.data) {
        // Update the state with the new details
        setListProductDetails(updatedDetails);
        message.success("Cập nhật thành công!");

        window.location.reload();
      }
    } catch (error) {
      message.error("Lỗi cập nhật!");
      console.error("Failed to save list", error);
    }
  };

  const handleEditChange = (e, record, field) => {
    let value = e.target.value;

    // Ensure that the value is the correct type
    if (field === "quantity" || field === "price") {
      value = value === "" ? 0 : Number(value);
      if (isNaN(value)) {
        value = 0;
      }
    }

    // Update the product details in state
    setListProductDetails((prev) =>
      prev.map((item) =>
        item.productDetailId === record.productDetailId && item[field] !== value
          ? { ...item, [field]: value } // Update field value
          : item
      )
    );
  };

  const handleFileChange = (file, record) => {
    setListProductDetails((prevList) =>
      prevList.map((item) =>
        item.productDetailId === record.productDetailId
          ? { ...item, file: file.originFileObj }
          : item
      )
    );
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("multipartFile", file);

    // Bắt đầu quá trình upload
    setLoading(true);

    try {
      const response = await FileUploadApi.uploadFileImage(formData);
      setLoading(false);
      return response.data; // Return image URL directly from response data
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
      throw error; // Rethrow error to handle in handleAddProduct
    }
  };

  const columns = [
    {
      title: (
        <Checkbox onChange={handleSelectAllChange} checked={selectAllChecked} />
      ),
      key: "checkBox",
      render: (_, record) => (
        <Checkbox
          onChange={() => handleCheckboxChange(record)}
          checked={listSelectRow.includes(record.productDetailId)}
        />
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "urlImg",
      key: "urlImg",
      render: (value, record) =>
        listSelectRow.includes(record.productDetailId) ? (
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            action="/upload" // URL upload của bạn
            maxCount={1}
            onChange={({ file }) => handleFileChange(file, record)}
          >
            {loading ? ( // Kiểm tra trạng thái loading
              <div>
                <Spin /> {/* Biểu tượng loading */}
              </div>
            ) : value ? (
              <img
                src={value}
                alt="product-img"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div>Upload</div>
            )}
          </Upload>
        ) : (
          <img src={value} width={150} />
        ),
    },
    {
      title: "Mã SP",
      dataIndex: "productCode",
      key: "productCode",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Danh mục",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "Chất liệu",
      dataIndex: "materialName",
      key: "materialName",
    },
    {
      title: "Màu sắc",
      dataIndex: "colorName",
      key: "colorName",
    },
    {
      title: "Size",
      dataIndex: "sizeName",
      key: "sizeName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) =>
        listSelectRow.includes(record.productDetailId) ? (
          <Input
            key={`quantity-${record.productDetailId}`} // Thêm key duy nhất
            value={record.quantity}
            onChange={(e) => handleEditChange(e, record, "quantity")}
            type="number"
          />
        ) : (
          <span>{record.quantity}</span>
        ),
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      render: (text, record) =>
        listSelectRow.includes(record.productDetailId) ? (
          <Input
            key={`price-${record.productDetailId}`} // Thêm key duy nhất
            value={record.price}
            onChange={(e) => handleEditChange(e, record, "price")}
            type="number"
          />
        ) : (
          <span>{new Intl.NumberFormat("vi-VN").format(record.price)} VND</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) =>
        listSelectRow.includes(record.productDetailId) ? (
          <Select
            key={`status-${record.productDetailId}`} // Thêm key duy nhất
            value={record.status}
            onChange={(value) => handleEditInputChange(value, record, "status")} // Gọi hàm khi thay đổi giá trị
            style={{ width: 120 }}
          >
            <Select.Option value={1}>Đang bán</Select.Option>
            <Select.Option value={0}>Ngừng bán</Select.Option>
          </Select>
        ) : (
          <span>{record.status === 1 ? "Đang bán" : "Ngừng bán"}</span>
        ),
    },

    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button size="small" onClick={() => handleOpenModal(record)}>
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </div>
      ),
    },
  ];

  // Modal product detail
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // dataListProduct
  const fetchData = async (productId, page = 1, size = 10) => {
    console.log("productId::::", productId);

    setLoading(true);

    try {
      const params = {
        id: productId,
        page: page - 1,
        size: size,
      };
      const response = await ProductDetailManagementApi.getProductDetails(
        params
      );
      setListProductDetails(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi người dùng thay đổi trang hoặc số lượng sản phẩm mỗi trang
  const handlePageChange = (page, size) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
    setPageSize(size); // Cập nhật kích thước trang
  };

  useEffect(() => {
    if (productId) {
      fetchData(productId, currentPage, pageSize); // Call fetchData with productId
    }
  }, [productId, currentPage, pageSize]); // Run this effect whenever productId changes

  const handleSearchData = async () => {
    console.log("Search text:", searchText);
    console.log("Brand id:", selectedBrand);
    console.log("Type id:", selectedType);
    console.log("Material id:", selectedMaterial);
    console.log("Color id:", selectedColor);
    console.log("Size id", selectedSize);
    console.log("State id:", selectedStatus);

    try {
      // Prepare the search parameters
      const params = {
        id: productId,
        page: 0,
        size: 10,
        brandId: selectedBrand,
        typeId: selectedType,
        materialId: selectedMaterial,
        colorId: selectedColor,
        sizeId: selectedSize,
        status: selectedStatus,
        productCode: searchText,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      };

      const response = await ProductDetailManagementApi.getProductDetails(
        params
      );
      setListProductDetails(response.data.content);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleRefresh = () => {
    setSearchText("");
    setSelectedBrand(null);
    setSelectedType(null);
    setSelectedMaterial(null);
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedStatus(null);
    setCurrentPage(1);
    fetchData(productId, 1, pageSize);
  };

  // search price
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [displayPriceRange, setDisplayPriceRange] = useState([
    "0 VND",
    "100,000,000 VND",
  ]);

  // Format number to currency with "VND"
  const formatCurrency = (value) => {
    return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
  };

  const handleSliderChange = (value) => {
    setPriceRange(value);
    setDisplayPriceRange([formatCurrency(value[0]), formatCurrency(value[1])]);
  };

  // Handle input change without formatting immediately
  const handleMinInputChange = (e) => {
    const newMin = Number(e.target.value.replace(/[^0-9]/g, ""));
    setPriceRange([newMin, priceRange[1]]);
    setDisplayPriceRange([e.target.value, displayPriceRange[1]]);
  };

  const handleMaxInputChange = (e) => {
    const newMax = Number(e.target.value.replace(/[^0-9]/g, ""));
    setPriceRange([priceRange[0], newMax]);
    setDisplayPriceRange([displayPriceRange[0], e.target.value]);
  };

  // Format the value on blur
  const handleMinInputBlur = () => {
    setDisplayPriceRange([formatCurrency(priceRange[0]), displayPriceRange[1]]);
  };

  const handleMaxInputBlur = () => {
    setDisplayPriceRange([displayPriceRange[0], formatCurrency(priceRange[1])]);
  };

  return (
    <div>
      <h1>Product Detail Management</h1>
      <Button
        type="default"
        onClick={handleBack}
        style={{ marginBottom: "16px" }}
      >
        Quay lại
      </Button>

<div style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "20px",
          boxShadow: "0px 0px 5px 0px #ccc",
        }}>

      <div className={styles.containerSearch}>
        <div className={styles.inputSearch}>
          <Input
            placeholder="Nhập mã sản phẩm ..."
            value={searchText}
            onChange={handleInputChange}
          ></Input>
          <div
            style={{
              width: "1000px",
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            {/* Minimum price input */}
            <Input
              type="text"
              value={displayPriceRange[0]}
              onChange={handleMinInputChange}
              onBlur={handleMinInputBlur}
              style={{ width: "120px", marginRight: "8px" }}
            />

            {/* Slider */}
            <Slider
              range
              min={0}
              max={10000000}
              step={1000}
              value={priceRange}
              onChange={handleSliderChange}
              tooltip={{ formatter: formatCurrency }}
              style={{ flex: 1, marginRight: "8px" }}
            />

            {/* Maximum price input */}
            <Input
              type="text"
              value={displayPriceRange[1]}
              onChange={handleMaxInputChange}
              onBlur={handleMaxInputBlur}
              style={{ width: "120px" }}
            />
          </div>
        </div>

        <div className={styles.selectSearch}>
          <div>
            <label>Brand: </label>
            <Select
              placeholder="Thương hiệu..."
              options={brandOptions}
              onChange={(value) => handleSelectChange("brand", value)}
              value={selectedBrand}
              allowClear
            ></Select>
          </div>
          <div>
            <label>Danh mục: </label>
            <Select
              placeholder="Loại giày..."
              options={typeOptions}
              onChange={(value) => handleSelectChange("type", value)}
              value={selectedType}
              allowClear
            />
          </div>
          <div>
            <label>Chất liệu: </label>
            <Select
              placeholder="Chất liệu..."
              options={materialOptions}
              onChange={(value) => handleSelectChange("material", value)}
              value={selectedMaterial}
              allowClear
            ></Select>
          </div>
          <div>
            <label>Màu sắc: </label>
            <Select
              placeholder="Màu sắc..."
              options={colorOptions}
              onChange={(value) => handleSelectChange("color", value)}
              value={selectedColor}
              allowClear
            ></Select>
          </div>
        </div>
        <div className={styles.selectSearch}>
          <div>
            <label>Kích cỡ: </label>
            <Select
              placeholder="Kích cỡ..."
              options={sizeOptions}
              onChange={(value) => handleSelectChange("size", value)}
              value={selectedSize}
              allowClear
            ></Select>
          </div>
          <div>
            <label>Trạng thái: </label>
            <Select
              placeholder="Trạng thái..."
              options={[
                { value: 1, label: "Đang bán" },
                { value: 0, label: "Dừng bán" },
              ]}
              onChange={(value) => handleSelectChange("status", value)}
              value={selectedStatus}
              allowClear
            ></Select>
          </div>
        </div>

        <div className={styles.ButtonSearch}>
          <Button type="primary" onClick={handleSearchData}>
            Tìm kiếm
          </Button>
          <Button onClick={handleRefresh}>Làm mới</Button>
        </div>
      </div>
</div>

<div style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "20px",
          boxShadow: "0px 0px 5px 0px #ccc",
        }}>

      <div className={styles.containerTable}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              handleSaveListProductDetails();
            }}
          >
            Lưu thay đổi
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={listProductDetails}
          loading={loading}
          rowKey="productDetailId"
          pagination={false}
        />

        <Pagination
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
          simple
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "50", "100"]}
        />
      </div>
        </div>


      <ModalProductDetail
        isModalOpen={isModalOpen}
        handleCancel={handleModalClose}
        onModalProductDetail={fetchData}
      />
    </div>
  );
};

export default ProductDetailManagement;
