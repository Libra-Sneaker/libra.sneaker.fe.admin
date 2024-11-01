import { Form, Input, Modal, message } from "antd";
import React, { useState } from "react";
import {TypeOfShoeManagementApi} from "../../api/admin/typeOfShoeManagement/TypeOfShoeManagementApi"



const ModalAddTypeOfShoe = ({ isModalOpen, handleCancel, onTypeOfShoeAdded }) => {
  const [form] = Form.useForm(); // Use Ant Design's Form instance
  const [name, setName] = useState("");

  const handleOk = async () => {
    try {
      const exists = await checkTypeOfShoeExists(name);
      if (exists) {
        message.error("Tên loại giày đã tồn tại! Vui lòng nhập tên khác.");
        return; // Stop further execution if type exists
      }

      await createTypeOfShoe();
      message.success("Loại giày đã được thêm thành công!");
      form.resetFields();
      handleCancel();
      onTypeOfShoeAdded(); // Refresh the list
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm loại giày!");
      console.error("Error creating type of shoe:", error);
    }
  };

  const createTypeOfShoe = async () => {
    const typeOfShoeData = { name };
    await TypeOfShoeManagementApi.create(typeOfShoeData); // Adjust API call
  };

  const checkTypeOfShoeExists = async (typeName) => {
    try {
      const response = await TypeOfShoeManagementApi.getTypes(); // Fetch all types
      return response.data.some(type => type.name.toLowerCase() === typeName.toLowerCase());
    } catch (error) {
      console.error("Error checking type existence:", error);
      return false;
    }
  };

  return (
    <Modal
      title="Thêm loại giày"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form}>
        <Form.Item
          label="Tên loại giày"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddTypeOfShoe;
