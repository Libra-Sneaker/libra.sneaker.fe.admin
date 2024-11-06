import styles from "./ProductManagement.module.css";
import { ProductManagementApi } from "../../api/admin/productManagement/ProductManagementApi";
import { Space, Table, Button, Radio, Pagination } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Search from "antd/es/transfer/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const ProductManagement = () => {
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("null");

  const columns = [
    { title: "STT", dataIndex: "rowNum", key: "row" },
    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
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
      render: (text, record) => (record.status === 1 ? "Đang bán" : "Dừng bán"),
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
        </Space>
      ),
    },
  ];

  const fetchData = async (page = 1, size = 10) => {
    console.log(`Fetching page: ${page}, size: ${size}`);
    setLoading(true);
    const params = {
      name: name,
      status: status === "all" || status === "null" ? undefined : status,
      page: page - 1, // Backend thường bắt đầu từ trang 0
      size: size,
    };

    try {
      const response = await ProductManagementApi.getProducts(params);
      console.log("Response data:", response.data);
      setListProduct(response.data.content);
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
    console.log(status);

    try {
      // Prepare the search parameters
      const params = {
        name: name,
        // Include status only if it's not 'all' or null
        status: status === "all" || status === "null" ? undefined : status,
      };

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

      <div className={styles.containerTable}>
        <div className={styles.contanerAddProduct}>
          <Button
            type="primary"
            className={styles.btnAddProduct}
            onClick={handleShowAddProduct}
          >
            Add Product
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
