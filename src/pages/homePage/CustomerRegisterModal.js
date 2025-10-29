import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import styles from "./RegisterModal.module.css";

const { Text } = Typography;

const CustomerRegisterModal = ({ visible, onClose, onSwitchToLogin }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);
    
    try {
      // TODO: Implement customer registration API
      console.log('Register data:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      form.resetFields();
      onClose();
      onSwitchToLogin();
    } catch (error) {
      message.error("Đăng ký thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          <h2>Đăng ký tài khoản</h2>
          <p className={styles.subtitle}>Tạo tài khoản để mua sắm dễ dàng hơn</p>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      className={styles.registerModal}
      destroyOnClose
    >
      <div className={styles.formContainer}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          initialValues={{ 
            name: "", 
            email: "", 
            phone: "",
            password: "", 
            confirmPassword: "" 
          }}
          className={styles.registerForm}
          size="large"
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên!" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự!" }
            ]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="Nhập họ và tên của bạn"
              className={styles.inputField}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="Nhập email của bạn"
              className={styles.inputField}
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />}
              placeholder="Nhập số điện thoại"
              className={styles.inputField}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu của bạn"
              className={styles.inputField}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu"
              className={styles.inputField}
            />
          </Form.Item>

          <Form.Item>
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className={styles.loginLink}
              >
                Đã có tài khoản? Đăng nhập
              </button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className={styles.submitButton}
              >
                Đăng ký
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CustomerRegisterModal;
