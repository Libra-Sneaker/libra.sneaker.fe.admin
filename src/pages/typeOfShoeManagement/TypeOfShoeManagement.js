import { Button, Input, Space, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { TypeOfShoeManagementApi } from '../../api/admin/typeOfShoeManagement/TypeOfShoeManagementApi';
import styles from './TypeOfShoeManagement.module.css'; 

const TypeOfShoeManagement = () => {
  const [listTypeOfShoe, setListTypeOfShoe] = useState([]); 
  const [filteredTypeOfShoe, setFilteredTypeOfShoe] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); 
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
      const response = await TypeOfShoeManagementApi.getTypeOfShoe(); 
      const typeOfShoesWithRowNum = response.data.map((item, index) => ({
        ...item,
        rowNum: index + 1,
      }));
      setListTypeOfShoe(typeOfShoesWithRowNum);
      setFilteredTypeOfShoe(typeOfShoesWithRowNum); 
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

  const handleSearchInputChange = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredTypeOfShoe(listTypeOfShoe);
    } else {
      const filteredData = listTypeOfShoe.filter((typeOfShoe) =>
        typeOfShoe.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredTypeOfShoe(filteredData);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  return (
    <div className={styles.typeOfShoeContainer}>
      <div className={styles.typeOfShoeSearch}>
        <Input
          placeholder="Search by brand name"
          value={searchText}
          onChange={handleSearchInputChange}
          className={styles.inputSearch}
          style={{ width: "50%" }}
        />
        <Button type="primary">Thêm loaị giày</Button>
      </div>
      <Table 
        columns={columns}
        dataSource={filteredTypeOfShoe}
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

export default TypeOfShoeManagement;
