import React, { useEffect, useState } from "react";
import styles from "./ProductDetailManagement.module.css";
import {
  Button,
  Checkbox,
  Input,
  Pagination,
  Select,
  Slider,
  Table,
  Upload,
} from "antd";
import { useNavigate, useParams } from "react-router";
import { BrandManagementApi } from "../../../api/admin/brandManagement/BrandManagementApi";
import { TypeOfShoeManagementApi } from "../../../api/admin/typeOfShoeManagement/TypeOfShoeManagementApi";
import { ColorManagementApi } from "../../../api/admin/colorManagemnet/ColorManagementApi";
import { MaterialManagementApi } from "../../../api/admin/materialManagement/MaterialManagementApi";
import { SizeManagementApi } from "../../../api/admin/sizeManagement/SizeManagementApi";
import { SearchOutlined } from "@ant-design/icons";
import { ProductDetailManagementApi } from "../../../api/admin/productDetailManagement/productDetailManagementApi";

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

  const [loading, setLoading] = useState(true);
  const [listProductDetails, setListProductDetails] = useState([]);
  const [searchProductDetails, setSearchProductDetails] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

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

  const ListDropDown = [
    {
      name: "Danh mục",
      options: typeOptions,
    },
    {
      name: "Hãng Giày",
      options: brandOptions,
    },
    {
      name: "Màu sắc",
      options: colorOptions,
    },
    {
      name: "Chất liệu",
      options: materialOptions,
    },
    {
      name: "Size",
      options: sizeOptions,
    },
    {
      name: "Trạng thái",
      options: [
        {
          value: "1",
          label: "Còn hàng",
        },
        {
          value: "0",
          label: "Hết hàng",
        },
      ],
    },
  ];

  const columns = [
    {
      title: <Checkbox />,
      key: "checkBox",
      render: (_, record) => <Checkbox />,
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
          showUploadList={false} // Hide the upload button if only displaying the image
        >
          {value ? (
            <img
              src={value}
              alt="product-img"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div>Upload</div> // Placeholder if no image URL is available
          )}
        </Upload>
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
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 1 ? "Đang bán" : "Ngừng bán"),
    },

    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button type="primary" size="small">
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  // dataListProduct

  const fetchData = async (productId, page = 1, size = 10) => {
    console.log("productId::::", productId);

    setLoading(true);

    try {
      const params = {
        id: productId,
        page: page - 1, // Backend thường bắt đầu từ trang 0
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

  const handleSelect = (value, field) => {
    console.log(value);

    setSelectedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    console.log("Selected values:", selectedValues);
    try {
      const params = {
        id: productId,
      };
      const response = await ProductDetailManagementApi.getProductDetails(
        params
      );
      console.log(response.data.content);

      // log(response.data.content);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const [priceRange, setPriceRange] = useState([20, 50]);

  const handleSliderChange = (value) => {
    setPriceRange(value);
  };

  const handleInputChange = (value, index) => {
    const newRange = [...priceRange];
    newRange[index] = value ? parseInt(value) : 0;
    setPriceRange(newRange);
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

      <div className={styles.containerSearch}>
        <div className={styles.InputSearch}></div>
        <div className={styles.selectSearch}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              gap: "10px",
            }}
          >
            <label>Tên sản phẩm</label>
            <Input
              placeholder="Tìm tên sản phẩm..."
              prefix={<SearchOutlined />}
            />
          </div>

          {ListDropDown.map((dropDown) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: "10px",
              }}
            >
              <label>{dropDown.name}</label>
              <Select
                onChange={(value) => handleSelect(value, dropDown.name)}
                defaultValue={{
                  value: dropDown.id,
                  label: dropDown.name,
                }}
                style={{
                  width: 120,
                }}
                options={dropDown.options}
              />
            </div>
          ))}
        </div>

        <div className={styles.btnSearch}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Input
              value={priceRange[0]}
              onChange={(e) => handleInputChange(e.target.value, 0)}
              style={{ width: "80px" }}
              type="number"
            />
            <div style={{ width: "400px" }}>
              <Slider
                range
                min={0}
                max={100}
                value={priceRange}
                onChange={handleSliderChange}
              />
            </div>
            <Input
              value={priceRange[1]}
              onChange={(e) => handleInputChange(e.target.value, 1)}
              style={{ width: "80px" }}
              type="number"
            />
          </div>
          <div>
            <Button
              style={{
                marginRight: "25px",
              }}
            >
              Làm mới
            </Button>
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.containerTable}>
        <Table
          columns={columns}
          dataSource={listProductDetails}
          loading={loading}
          rowKey="id"
          pagination={false}
        />

        <Pagination
        style={{
          padding:"20px",
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
  );
};

export default ProductDetailManagement;
