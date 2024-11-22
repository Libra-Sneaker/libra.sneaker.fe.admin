import styles from "./ProductManagement.module.css";
import { ProductManagementApi } from "../../api/admin/productManagement/ProductManagementApi";
import {
  Space,
  Table,
  Button,
  Radio,
  Pagination,
  Select,
  message,
  Input,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Search from "antd/es/transfer/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { PlusOutlined } from "@ant-design/icons";

const ProductManagement = () => {
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("null");

  const [editingProductId, setEditingProductId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);

  const columns = [
    { title: "STT", dataIndex: "rowNum", key: "row" },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) =>
        editingProductId === record.id ? (
          <Input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Ngày thêm",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    { title: "Số lượng", dataIndex: "totalQuantity", key: "totalQuantity" },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status, record) =>
        editingProductId === record.id ? (
          <Select
            value={editingStatus}
            onChange={(value) => setEditingStatus(value)}
            style={{ width: "100%" }}
          >
            <Select.Option value="1">Đang bán</Select.Option>
            <Select.Option value="0">Dừng bán</Select.Option>
          </Select>
        ) : status === "1" ? (
          <Tag
            style={{
              display: "flex",
              width: "80px",
              height: "32px",
              lineHeight: "32px",
              borderRadius: "5px",
              fontSize: "13px",
              cursor: "pointer",
              marginBottom: "5px",
              justifyContent: "center",
              alignItems: "center",
            }}
            color="green"
          >
            Đang bán
          </Tag>
        ) : (
          <Tag
            style={{
              display: "flex",
              width: "80px",
              height: "32px",
              lineHeight: "32px",
              borderRadius: "5px",
              fontSize: "13px",
              cursor: "pointer",
              marginBottom: "5px",
              justifyContent: "center",
              alignItems: "center",
            }}
            size="large"
            color="red"
          >
            Dừng bán
          </Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => navigate(`/product-detail-management/${record.id}`)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>

          {editingProductId === record.id ? (
            <>
              <Button onClick={() => handleSave(record.id)}>Save</Button>
              <Button onClick={handleCancelEdit}>Cancel</Button>
            </>
          ) : (
            <Button onClick={() => handleEdit(record)}>Edit</Button>
          )}
        </Space>
      ),
    },
  ];
  const handleEdit = (record) => {
    console.log(record.productName);

    setEditingProductId(record.id);
    setEditingName(record.productName);
    setEditingStatus(record.status);
  };

  const handleSave = async (id) => {
    console.log(editingName);
    console.log(editingStatus);

    try {
      await ProductManagementApi.updateNameAndStatusProduct(
        id,
        editingName,
        editingStatus
      );
      setEditingProductId(null);
      fetchData(currentPage, pageSize);
      message.success("Cập nhật sản phẩm thành công!");
    } catch (error) {
      message.error("Có lỗi khi cập nhật sản phẩm!");
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
  };

  const fetchData = async (page = 1, size = 10) => {
    console.log(`Fetching page: ${page}, size: ${size}`);
    setLoading(true);
    const params = {
      name: name,
      status:
        status === "all" || status === "null"
          ? undefined
          : status === "2"
          ? 0
          : status,
      page: page - 1,
      size: size,
    };

    try {
      const response = await ProductManagementApi.getProducts(params);
      console.log("Response data:", response.data);

      // Update status if totalQuantity is 0
      const updatedProducts = response.data.content.map((product) => {
        product.status = product.status.toString();
        if (product.totalQuantity === 0) {
          return { ...product, status: "0" }; // Set status to 0 (Dừng bán) if totalQuantity is 0
        }
        
        return product;
      });

      setListProduct(updatedProducts);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Xử lý khi người dùng thay đổi trang hoặc số lượng sản phẩm mỗi trang
  const handlePageChange = (page, size) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
    setPageSize(size); // Cập nhật kích thước trang
  };

  const handleSearch = async () => {
    console.log(name);
    console.log("status");
    console.log(typeof status);
    console.log(status);
    const statusNumber = parseInt(status, 10);
    console.log("statusNumber:", statusNumber);
    console.log(typeof statusNumber);

    try {
      // Prepare the search parameters
      const params = {};

      // Chỉ thêm name nếu có giá trị
      if (name) {
        params.name = name;
      }

      // Chỉ thêm status nếu có giá trị khác "all" và "null"
      if (status && status !== "all" && status !== "null") {
        if (statusNumber === 2) {
          params.status = 0; // Truyền status là 0 cho "Dừng bán"
        } else {
          params.status = statusNumber; // Truyền status là 1 cho "Đang bán"
        }
      }

      const response = await ProductManagementApi.getProducts(params);
      setListProduct(response.data.content);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleRefresh = () => {
    setName(""); // Reset the name field
    setStatus("null"); // Reset the status field to the default value
    fetchData(); // Fetch the full product list again
  };

  const handleShowAddProduct = () => {
    navigate("/add-product-management");
  };

  return (
    <div className={styles.productContainer}>
      <div className="headerProductContainer">
        <h1>Sản Phẩm</h1>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "20px",
            boxShadow: "0px 0px 5px 0px #ccc",
          }}
        >
          <div className={styles.headerProduct}>
            <div className={styles.searchContainer}>
              <Search
                className={styles.inputSearch}
                placeholder="Tìm kiếm sản phẩm..."
                onChange={(e) => setName(e.target.value)}
                value={name}
                onPressEnter={handleSearch}
              />

              <div className={styles.radioContainer}>
                <span className={styles.statusLabel}>Trạng thái: </span>
                <Radio.Group
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <Radio value="all">Tất cả</Radio>
                  <Radio value="1">Đang bán</Radio>
                  <Radio value="2">Dừng bán</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
          <div className={styles.containerSearchReset}>
            <Button
              className={styles.btnRefreshProduct}
              onClick={handleRefresh}
              style={{ marginLeft: "8px" }} // Add some margin for spacing
            >
              Refresh
            </Button>
            <Button
              className={styles.btnSearchProduct}
              type="primary"
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "20px",
          boxShadow: "0px 0px 5px 0px #ccc",
        }}
      >
        <div className={styles.contanerAddProduct}>
          <Button
            icon={<PlusOutlined />}
            style={{
              backgroundColor: "orange",
              borderColor: "orange",
              color: "white",
            }}
            className={styles.btnAddProduct}
            onClick={handleShowAddProduct}
          >
            Thêm sản phẩm
          </Button>
        </div>
        <Table
          className={styles.tableProduct}
          columns={columns}
          dataSource={listProduct}
          loading={loading}
          rowKey="id"
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
  );
};

export default ProductManagement;
