import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../app/reducer/common/LoadingSlice.reducer";
import { LoginApi } from "../../api/admin/login/LoginApi";
import { SCREEN } from "../../router/screen";

const { Text } = Typography;

const LoginModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    dispatch(SetLoading(true));

    try {
      const response = await LoginApi.login({
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        const data = response.data;
        // Lưu thông tin vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", data.name);

        // Đóng modal và chuyển hướng
        onClose();
        navigate(SCREEN.productManagement.path);
        message.success("Đăng nhập thành công!");
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          message.error(data.message || "Đăng nhập thất bại!");
        } else {
          message.error("Đã có lỗi xảy ra! Vui lòng thử lại.");
        }
      } else {
        message.error(
          "Không thể kết nối đến server! Vui lòng kiểm tra kết nối."
        );
      }
    } finally {
      setLoading(false);
      dispatch(SetLoading(false));
    }
  };

  return (
    <Modal
      title="Đăng nhập"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleLogin}
        initialValues={{ email: "", password: "" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
