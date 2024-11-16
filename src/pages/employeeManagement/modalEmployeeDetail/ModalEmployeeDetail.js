import {
  Button,
  Col,
  DatePicker,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import styles from "./ModalEmployeeDetail.module.css";
import dayjs from "dayjs";
import { EmployeeManagementApi } from "../../../api/admin/employeeManagement/EmployeeManagementApi";
import { useNavigate } from "react-router";
import { Option } from "antd/es/mentions";

const ModalEmployeeDetail = ({ isModalOpen, handleCancel, employeeDetail }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [sex, setSex] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");
  const [deleteFlag, setDeleteFlag] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Họ và tên không được để trống.";
    if (!phoneNumber)
      newErrors.phoneNumber = "Số điện thoại không được để trống.";
    if (!email) newErrors.email = "Email không được để trống.";
    if (!address) newErrors.address = "Địa chỉ không được để trống.";
    if (!dateOfBirth) newErrors.dateOfBirth = "Ngày sinh không được để trống.";
    if (role === "") newErrors.role = "Chức vụ không được để trống.";
    if (!deleteFlag) newErrors.deleteFlag = "Password không được để trống.";

    setErrors(newErrors); // Cập nhật trạng thái lỗi
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  // Khi nhận dữ liệu employeeDetail, cập nhật trạng thái
  useEffect(() => {
    console.log(employeeDetail);

    if (employeeDetail) {
      setCode(employeeDetail.employeeCode);
      setName(employeeDetail.name || "");
      setSex(employeeDetail.sex + "" || "");
      setPhoneNumber(employeeDetail.phoneNumber || "");
      setEmail(employeeDetail.email || "");
      setAddress(employeeDetail.address || "");
      setDateOfBirth(employeeDetail.dateOfBirth || "");
      setRole(employeeDetail.role + "" || "");
      setDeleteFlag(employeeDetail.deleteFlag + "" || "");
    }
  }, [employeeDetail]);

  // **Kiểm tra giá trị khi chọn ngày sinh**
  const handleDateChange = (date, dateString) => {
    if (date) {
      console.log("Year:", date.year()); // Chỉ gọi khi `date` là hợp lệ
      console.log("Formatted Date:", dateString); // Chuỗi ngày định dạng "YYYY-MM-DD"
      setDateOfBirth(dateString); // Cập nhật giá trị state
    } else {
      console.log("No date selected");
      setDateOfBirth(""); // Đặt lại giá trị nếu không có ngày
    }
  };

  // **Kiểm tra và lưu thay đổi**
  // Handle save (update employee)
  const handleSave = async () => {
    if (!validateFields()) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const phoneNumberPattern = /^[0-9]+$/;
    if (!phoneNumberPattern.test(phoneNumber)) {
      message.error("Số điện thoại chỉ được phép chứa số.");
      return;
    }

    const updatedEmployee = {
      code,
      name,
      sex,
      phoneNumber,
      email,
      address,
      dateOfBirth,
      role,
      deleteFlag,
    };

    console.log("Employee Updated:", updatedEmployee);

    try {
      // API call to update the employee
      await EmployeeManagementApi.update(updatedEmployee);
      message.success("Nhân viên được cập nhật thành công!");
      handleCancel(true); // Close the modal on success
    } catch (error) {
      if (error.response?.status === 400) {
        message.error("Email này đã tồn tại. Vui lòng sử dụng email khác.");
      } else {
        console.error("Error updating employee:", error);
        message.error("Có lỗi xảy ra khi sửa thông tin nhân viên.");
      }
    }
  };

  return (
    <Modal
      width={600}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button type="primary" onClick={handleSave}>
          Lưu thay đổi
        </Button>,

        <Button key="close" onClick={handleCancel}>
          Close
        </Button>,
      ]}
    >
       {/* Ảnh */}
       <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className={styles.imgContainer}>Img</div>
      </div>

      {/* Họ và tên */}
      <Row gutter={[16, 24]}>
        <Col style={{
          marginBottom: "10px",
          marginTop: '10px'
        }} span={24}>
          <label>Họ và tên:</label>
          <Input
            className={styles.selectContainer}
            placeholder="Nhập họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
      </Row>

      {/* Thông tin chi tiết */}
      <Row gutter={[16, 24]}>
        {/* Cột bên trái */}
        <Col span={12}>
          <div style={{
          marginBottom: "5px",
          marginTop: '5px'
        }}>
            <label>Giới tính:</label>
            <Select
              placeholder="Chọn giới tính"
              className={styles.selectContainer}
              value={sex !== "" ? String(sex) : undefined}
              onChange={(value) => setSex(value)}
            >
              <Select.Option value="1">Nam</Select.Option>
              <Select.Option value="0">Nữ</Select.Option>
            </Select>
          </div>
          <div style={{
          marginBottom: "5px",
          marginTop: '5px'
        }}>
            <label>Số điện thoại:</label>
            <Input
              className={styles.selectContainer}
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div style={{
          marginBottom: "5px",
          marginTop: '5px'
        }}>
            <label>Email:</label>
            <Input
              className={styles.selectContainer}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Col>

        {/* Cột bên phải */}
        <Col  span={12}>
          <div style={{
          marginBottom: "5px",
          marginTop: '5px'
        }}>
            <label>Ngày sinh:</label>
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              value={dateOfBirth ? dayjs(dateOfBirth, "YYYY-MM-DD") : null}
              onChange={handleDateChange}
            />
          </div>
          <div style={{
          marginBottom: "5px",
          marginTop: '5px'
        }}>
            <label>Chức vụ:</label>
            <Select
              placeholder="Chọn chức vụ"
              className={styles.selectContainer}
              value={role !== "" ? String(role) : undefined}
              onChange={(value) => setRole(value)}
            >
              <Select.Option value="0">Quản lý</Select.Option>
              <Select.Option value="1">Nhân viên</Select.Option>
            </Select>
          </div>
          <div style={{
          marginBottom: "5px",
          marginTop: '5px'
        }}>
            <label>Trạng thái:</label>
            <Select
              placeholder="Chọn trạng thái"
              className={styles.selectContainer}
              value={deleteFlag !== "" ? String(deleteFlag) : undefined}
              onChange={(value) => setDeleteFlag(value)}
            >
              <Select.Option value="0">Hoạt động</Select.Option>
              <Select.Option value="1">Ngừng hoạt động</Select.Option>
            </Select>
          </div>
        </Col>
      </Row>

      {/* Địa chỉ */}
      <Row gutter={[16, 24]}>
        <Col style={{
          marginBottom: "5px",
          marginTop: '10px'
        }} span={24}>
          <label>Địa chỉ:</label>
          <Input
            className={styles.selectContainer}
            placeholder="Nhập địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalEmployeeDetail;
