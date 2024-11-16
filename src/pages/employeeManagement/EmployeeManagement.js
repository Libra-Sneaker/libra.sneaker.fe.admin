import React, { useEffect, useState } from "react";
import styles from "./EmployeeManagement.module.css";
import { Button, message, Popconfirm, Table, Tag } from "antd";
import { EmployeeManagementApi } from "../../api/admin/employeeManagement/EmployeeManagementApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import ModalEmployeeDetail from "./modalEmployeeDetail/ModalEmployeeDetail";

const EmployeeManagement = () => {
  const [listEmployees, setListEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const navigate = useNavigate();

  const fetchData = async (page = 1, size = 10) => {
    console.log(`Fetching page: ${page}, size: ${size}`);
    setLoading(true);
    const params = {
      page: page - 1,
      size: size,
    };

    try {
      const response = await EmployeeManagementApi.search(params);
      console.log("Response data:", response.data);
      setListEmployees(response.data.content);
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

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee); // Cập nhật nhân viên được chọn
    console.log("Selected Employee Data:", employee);
    setIsModalOpen(true); // Mở modal
  };

  const handleModalClose = (refresh = false) => {
    setIsModalOpen(false);
    if (refresh) {
      fetchData(currentPage, pageSize); // Gọi lại API để load dữ liệu mới
    }
  };

  const columns = [
    { title: "STT", dataIndex: "rowNum", key: "row" },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã nhân viên",
      dataIndex: "employeeCode",
      key: "employeeCode",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Giới tính",
      dataIndex: "sex",
      key: "sex",
      render: (sex) => (sex === 1 ? "Nam" : "Nữ"),
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
      render: (role) => (role === 1 ? "Nhân viên" : "Quản lý"),
    },
    {
      title: "Trạng thái",
      dataIndex: "deleteFlag",
      key: "deleteFlag",
      render: (deleteFlag) =>
        deleteFlag === 0 ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="red">Dừng hoạt động</Tag>
        ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button 
          size="small" 
          onClick={() => handleOpenModal(record)}
          style={{
            marginLeft: "10px",
            borderRadius: "5px",
            margin: "10px",
            padding: "10px",
          }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Popconfirm
            title={
              record.deleteFlag === 0
                ? "Bạn chắc muốn dừng hoạt động nhân sự này chứ?"
                : "Bạn có chắc chắn muốn kích hoạt lại nhân sự này chứ?"
            }
            onConfirm={() => handleDeleteEmployee(record.id, record.deleteFlag)} // Confirm deletion
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<FontAwesomeIcon icon={faTrash} style={{ color: "red" }} />}
            ></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Handle delete function
  const handleDeleteEmployee = async (id, deleteFlag) => {
    console.log(id);
    console.log(deleteFlag);

    try {
      if (deleteFlag === 1) {
        await EmployeeManagementApi.updateDeleteFlagEmployee(id, 0);
        console.log("Status set to 0.");
      } else {
        await EmployeeManagementApi.updateDeleteFlagEmployee(id, 1);
        console.log("Status set to 1.");
      }

      fetchData();
      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating type:", error);
      message.error("Có lỗi xảy ra khi cập nhật thương hiệu.");
    }
  };

  const handleAddEmployee = () => {
    navigate("/add-employee-management");
  };

  return (
    <div>
      <h1>Danh sách nhân viên</h1>

      <div className={styles.SearchContainer}></div>

      <div className={styles.employeeContainer}>
        <div className={styles.AddEmployeeBtnContainer}>
          <Button type="primary" onClick={handleAddEmployee}>
            Thêm nhân viên
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={listEmployees}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            onChange: handlePageChange,
          }}
        />
      </div>

      <ModalEmployeeDetail
        isModalOpen={isModalOpen}
        handleCancel={handleModalClose}
        employeeDetail={selectedEmployee} // Truyền thông tin chi tiết nhân viên vào modal
      />
    </div>
  );
};

export default EmployeeManagement;
