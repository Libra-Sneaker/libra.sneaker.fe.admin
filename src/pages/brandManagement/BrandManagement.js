import { Button, Input, Space, Table } from "antd/es";
import styles from "./brandManagement.module.css";
import { useEffect, useState } from "react";
import { BrandManagementApi } from "../../api/admin/brandManagement/BrandManagementApi";
import moment from "moment";

const BrandManagement = () => {
  const [listBrand, setListBrand] = useState([]); // Full list of brands
  const [filteredBrands, setFilteredBrands] = useState([]); // Filtered list for display
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // Track search input
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const columns = [
    { title: "STT", dataIndex: "rowNum", key: "row" },
    { title: "Tên hãng", dataIndex: "name", key: "name" },
    { 
      title: "Ngày thêm", 
      dataIndex: "createdDate", 
      key: "createdDate", 
      render: (text) => moment(text).format("DD/MM/YYYY"), 
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" link>
            Update
          </Button>
          <Button type="primary">Detail</Button>
          <Button type="primary" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Fetch data once on initial load
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await BrandManagementApi.getBrands();
      const brandsWithRowNum = response.data.map((item, index) => ({
        ...item,
        rowNum: index + 1,
      }));
      setListBrand(brandsWithRowNum);
      setFilteredBrands(brandsWithRowNum); // Initially, all brands are displayed
      setPagination((prev) => ({
        ...prev,
        total: response.data.totalElements,
      }));
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredBrands(listBrand); // Reset to full list when search is empty
    } else {
      const filteredData = listBrand.filter((brand) =>
        brand.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredBrands(filteredData);
    }
  };

  // Handle pagination changes
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  return (
    <div className={styles.brandContainer}>
      <div className={styles.brandSearch}>
        <Input
          placeholder="Search by brand name"
          value={searchText}
          onChange={handleSearchInputChange}
          className={styles.inputSearch}
          style={{ width: "50%" }}
        />
        <Button type="primary">Thêm hãng</Button>
      </div>
      <Table 
        columns={columns}
        dataSource={filteredBrands}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default BrandManagement;
