import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./AddEmployee.module.css";
import dayjs from "dayjs";
import { EmployeeManagementApi } from "../../../api/admin/employeeManagement/EmployeeManagementApi";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [employeeData, setEmployeeData] = useState({});
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleBack = () => {
    navigate("/employee-management");
  };

  const handleSubmit = async () => {
    try {
      // Validate toàn bộ các trường trong form
      const values = await form.validateFields();

      // Nếu không có lỗi, tiếp tục xử lý dữ liệu
      const employeeData = {
        ...values,
        dateOfBirth: dateOfBirth, // Đã là chuỗi định dạng "YYYY-MM-DD"
      };

      console.log("Employee Data:", employeeData);

      // Gửi dữ liệu lên server
      await EmployeeManagementApi.create(employeeData);
      message.success("Nhân viên được thêm thành công!");

      // Xóa dữ liệu trong form sau khi thành công
      form.resetFields();
      setDateOfBirth("");

      // Điều hướng về trang quản lý nhân viên
      navigate("/employee-management");
    } catch (errorInfo) {
      // Nếu là lỗi từ validate phía frontend
      if (errorInfo?.errorFields?.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }

      // Nếu lỗi là từ phía backend
      if (errorInfo.response?.status === 400) {
        message.error("Email này đã tồn tại. Vui lòng sử dụng email khác.");  
      } else {
        console.error("Error adding employee:", errorInfo);
        message.error("Có lỗi xảy ra khi thêm nhân viên.");
      }
    }
  };

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

  return (
    <div>
      <h2>Nhân viên &gt; Thêm nhân viên</h2>

      <div className={styles.FormAddEmployee}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên nhân viên"
                rules={[
                  { required: true, message: "Vui lòng nhập tên nhân viên" },
                ]}
              >
                <Input placeholder="Nhập tên nhân viên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]+$/, // This regex allows only numbers
                    message: "Vui lòng nhập chỉ số",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  value={dateOfBirth ? dayjs(dateOfBirth, "YYYY-MM-DD") : null} // Chuyển đổi thành dayjs object
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  {
                    type: "email",
                    message: "Vui lòng nhập email hợp lệ",
                    trigger: "onBlur", // Validate khi người dùng rời khỏi trường
                  },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Chức vụ"
                rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
              >
                <Select placeholder="Chọn chức vụ">
                  <Select.Option value="0">Quản lý</Select.Option>
                  <Select.Option value="1">Nhân viên</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sex"
                label="Giới tính"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="1">Nam</Select.Option>
                  <Select.Option value="0">Nữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            
          </Row>
        </Form>

        <div className={styles.SubmitContainer}>
          <Button
            type="default"
            onClick={handleBack}
            style={{
              marginBottom: "16px",

              marginLeft: "16px",
            }}
          >
            Quay lại
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn thêm nhân sự này ?"
            onConfirm={handleSubmit}
            onCancel={() => console.log("Thêm nhân sự bị hủy")}
            okText="Đúng"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              style={{
                marginBottom: "16px",
                marginLeft: "16px",
              }}
            >
              Thêm mới
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
