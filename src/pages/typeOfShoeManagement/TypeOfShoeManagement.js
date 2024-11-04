import { Button, Input, message, Popconfirm, Space, Table } from "antd/es";
import styles from "./TypeOfShoeManagement.module.css"; // Adjust the styles accordingly
import { useEffect, useState } from "react";
import { TypeOfShoeManagementApi } from "../../api/admin/typeOfShoeManagement/TypeOfShoeManagementApi";
import moment from "moment";
import ModalAddTypeOfShoe from "./ModalAddTypeOfShoe"; // Import your ModalAddTypeOfShoe component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

const TypeOfShoeManagement = () => {
  const [editingKey, setEditingKey] = useState(""); // Track which row is being edited
  const [newName, setNewName] = useState(""); // Track new name input

  const [listTypeOfShoe, setListTypeOfShoe] = useState([]); // Full list of shoe types
  const [filteredTypes, setFilteredTypes] = useState([]); // Filtered list for display
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // Track search input
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Function to fetch shoe types
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await TypeOfShoeManagementApi.getTypeOfShoe(); // Adjust API call
      const typesWithRowNum = response.data.map((item, index) => ({
        ...item,
        rowNum: index + 1,
      }));
      setListTypeOfShoe(typesWithRowNum);
      setFilteredTypes(typesWithRowNum); // Initially, all types are displayed
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
      setFilteredTypes(listTypeOfShoe); // Reset to full list when search is empty
    } else {
      const filteredData = listTypeOfShoe.filter((type) =>
        type.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredTypes(filteredData);
    }
  };

  const handleEdit = (record) => {
    setEditingKey(record.id);
    setNewName(record.name);
  };

  const handleSave = async (id) => {
    const typeData = { id, name: newName };

    try {
      await TypeOfShoeManagementApi.updateTypeOfShoe(id, typeData); // Call API with id and data
      const updatedList = listTypeOfShoe.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      );
      setListTypeOfShoe(updatedList);
      setFilteredTypes(updatedList);
      setEditingKey(""); // Reset editing state
      message.success("Loại giày đã được cập nhật thành công!"); // Show success message
    } catch (error) {
      console.error("Error updating type of shoe:", error);
      message.error("Có lỗi xảy ra khi cập nhật loại giày!"); // Show error message
    }
  };

  // Handle delete function
  const handleDeleteType = async (id, status) => {
    console.log(id);
    console.log(status);

    try {
      if (status === 1) {
        await TypeOfShoeManagementApi.updateStatusTypeOfShoe(id, 0);
        console.log("Status set to 0.");
      } else {
        await TypeOfShoeManagementApi.updateStatusTypeOfShoe(id, 1);
        console.log("Status set to 1.");
      }

      fetchData();
      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating type:", error);
      message.error("Có lỗi xảy ra khi cập nhật thương hiệu.");
    }
  };

  const columns = [
    { title: "STT", dataIndex: "rowNum", key: "row" },
    {
      title: "Tên loại giày",
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span>{text === 1 ? "Đang hoạt động" : "Ngừng hoạt động"}</span>
      ),
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
            <Button onClick={() => handleEdit(record)}>
              <FontAwesomeIcon icon={faEye} />
            </Button>
          )}
          <Popconfirm
            title={
              record.status === 1
                ? "Bạn chắc muốn dừng hoạt động thương hiệu này chứ?"
                : "Bạn có chắc chắn muốn kích hoạt lại thương hiệu này chứ?"
            }
            onConfirm={() => handleDeleteType(record.id, record.status)} // Confirm deletion
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<FontAwesomeIcon icon={faTrash} style={{ color: "red" }} />}
            ></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.typeOfShoeContainer}>
      <h2>Loại giày</h2>

      <div className={styles.typeOfShoeSearch}>
        <Input
          placeholder="Tìm kiếm loại giày"
          value={searchText}
          onChange={handleSearchInputChange}
          style={{ width: "50%" }}
        />
        <Button type="primary" onClick={handleOpenModal}>
          Thêm loại giày
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredTypes}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
        }}
      />
      <ModalAddTypeOfShoe
        isModalOpen={isModalOpen}
        handleCancel={handleModalClose}
        onTypeOfShoeAdded={fetchData}
      />
    </div>
  );
};

export default TypeOfShoeManagement;
