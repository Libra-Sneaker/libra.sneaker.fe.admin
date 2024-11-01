import React from "react";
import styles from "./AddProductManagement.module.css";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import { CloseOutlined } from '@ant-design/icons';

const AddProductManagement = () => {
  const [form] = Form.useForm();
  return (
    <div className={styles.addProductContainer}>
      <h2>Sản phẩm &gt; Thêm sản phẩm</h2>

      <div className={styles.formProductContainer}>
      <Form form={form}>
        <Form.Item
          label="Tên loại giày"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên thương hiệu"
          name="brandId"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Chất liệu"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Loại giày"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>
      </Form>

      </div>
      <div className={styles.formProductContainer}>
      <Form form={form}>
        <Form.Item
          label="Tên loại giày"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên thương hiệu"
          name="brandId"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Chất liệu"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Loại giày"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên loại giày!" }]}
        >
          <Input />
        </Form.Item>
      </Form>

      </div>
    </div>
  );
};

export default AddProductManagement;
