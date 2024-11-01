import { Button, Input, message, Popconfirm, Space, Table } from "antd/es";
import styles from "./brandManagement.module.css";
import { useEffect, useState } from "react";
import { BrandManagementApi } from "../../api/admin/brandManagement/BrandManagementApi";
import moment from "moment";
import ModalAddBrand from "./ModalAddBrand"; // Import your ModalAddBrand component

const BrandManagement = () => {
  const [editingKey, setEditingKey] = useState(""); // Track which row is being edited
  const [newName, setNewName] = useState(""); // Track new name input

  const [listBrand, setListBrand] = useState([]); // Full list of brands
  const [id, setId] = useState(null);
  const [filteredBrands, setFilteredBrands] = useState([]); // Filtered list for display
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // Track search input
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleUpdateBrand = async (id) => {
    console.log(id);
  };

  const handleDeleteBrand = async (id) => {
    console.log(id);

    try {
      await BrandManagementApi.deleteBrands(id);
      const updatedList = listBrand.filter((item) => item.id !== id);
      setListBrand(updatedList);
      setFilteredBrands(updatedList);
      setPagination({ ...pagination, total: updatedList.length });
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const columns = [
    { title: "STT", dataIndex: "rowNum", key: "row" },
    {
      title: "Tên hãng",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        const editable = editingKey === record.id; // Check if the current row is being edited
        return editable ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onPressEnter={() => handleSave(record.id)} // Save on Enter key press
          />
        ) : (
          <span>{text}</span>
        );
      },
    },

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
          {editingKey === record.id ? (
            <>
              <Button type="primary" onClick={() => handleSave(record.id)}>
                Save
              </Button>
              <Button onClick={() => setEditingKey("")}>Cancel</Button>
            </>
          ) : (
            <Button type="primary" onClick={() => handleEdit(record)}>
              Edit
            </Button>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thương hiệu này?"
            onConfirm={() => handleDeleteBrand(record.id)} // Confirm deletion
            onCancel={() => console.log("Delete canceled")} // Optional: Handle cancellation
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
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
        name: item.name.toUpperCase(),
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (record) => {
    setEditingKey(record.id);
    setNewName(record.name);
  };

  const handleSave = async (id) => {
    const brandData = {
      id: id,
      name: newName,
      status: 1, // Gán giá trị status mặc định là 1
  };

  console.log(brandData);
  
    
  try {
    await BrandManagementApi.updateBrands(id, brandData); // Gọi API với id và data
    const updatedList = listBrand.map((item) =>
        item.id === id ? { ...item, name: newName, status: 1 } : item // Cập nhật cả status nếu cần
    );
    setListBrand(updatedList);
    setFilteredBrands(updatedList);
    setEditingKey(""); // Reset editing state
    message.success("Thương hiệu đã được cập nhật thành công!"); // Show success message
} catch (error) {
    console.error("Error updating brand:", error);
    message.error("Có lỗi xảy ra khi cập nhật thương hiệu!"); // Show error message
}
};


  return (
    <div className={styles.brandContainer}>
      <h2>Thương hiệu</h2>
      <div className={styles.brandSearch}>
        <Input
          placeholder="Tìm kiếm thương hiệu..."
          value={searchText}
          onChange={handleSearchInputChange}
          className={styles.inputSearch}
          style={{ width: "50%" }}
        />
        <Button type="primary" onClick={handleOpenModal}>
          Thêm thương hiệu
        </Button>
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
      <ModalAddBrand
        isModalOpen={isModalOpen}
        handleCancel={handleModalClose}
        onBrandAdded={fetchData}
      />
    </div>
  );
};

export default BrandManagement;
