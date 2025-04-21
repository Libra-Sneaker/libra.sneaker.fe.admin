// components/Header.js
import React, { useState } from "react";
import { Button, Space, Typography } from "antd";
import LoginModal from "../LoginModal";
import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import styles from "./Header.module.css";

const { Text } = Typography;

const Header = () => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const handleOpenLoginModal = () => {
    setLoginModalVisible(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalVisible(false);
  };

  // Hàm xử lý cuộn xuống phần "Liên hệ với chúng tôi"
  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hàm xử lý cuộn lên đầu trang
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        backgroundColor: "#fff", // Màu nền trắng giống trong hình
        color: "#000",
        padding: "10px 40px",
        position: "sticky",
        top: 0,
        zIndex: 999,
        height: 60,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Thêm bóng nhẹ cho header
      }}
    >
      {/* Bên trái: Logo */}
      <div>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#000",
          }}
        >
          LIBRA SNEAKER
        </Text>
      </div>

      {/* Giữa: Các mục điều hướng */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
          fontSize: 16,
          fontWeight: 500,
          color: "#000",
        }}
      >
        <div
          className={styles.title}
          onClick={handleScrollToTop} // Thêm sự kiện onClick để cuộn lên đầu
          style={{ cursor: "pointer" }} // Thêm con trỏ để biểu thị có thể nhấp
        >
          Trang chủ
        </div>
        <div className={styles.title}>Sản Phẩm</div>
        <div className={styles.title}>Giới Thiệu</div>
        <div
          className={styles.title}
          onClick={handleScrollToContact} // Thêm sự kiện onClick
          style={{ cursor: "pointer" }} // Thêm con trỏ để biểu thị có thể nhấp
        >
          Liên Hệ
        </div>
      </div>

      {/* Bên phải: Nút Đăng nhập và biểu tượng dấu cộng */}
      <Space size="middle">
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#000",
            cursor: "pointer",
          }}
        >
          +
        </div>
        <Button
          type="primary"
          style={{
            backgroundColor: "#4a90e2", // Màu xanh dương giống trong hình
            borderColor: "#4a90e2",
            borderRadius: 20, // Bo góc
            fontWeight: 500,
          }}
          onClick={handleOpenLoginModal}
        >
          Đăng nhập
        </Button>
      </Space>

      {/* Modal đăng nhập */}
      <LoginModal visible={loginModalVisible} onClose={handleCloseLoginModal} />
    </div>
  );
};

export default Header;
