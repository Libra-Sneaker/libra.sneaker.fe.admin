import styles from "./ProductManagement.module.css";
import { ProductManagementApi } from "../../api/admin/productManagement/ProductManagementApi";
import { Space, Table, Button, Radio } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Search from "antd/es/transfer/search";

const ProductManagement = () => {
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            type="primary"
            onClick={() => navigate(`/product-detail-management/${record.id}`)}
          >
            Detail
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ProductManagementApi.getProducts();
      setListProduct(response.data.content);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        />
      </div>
    </div>
  );
};

export default ProductManagement;
