import {
  Button,
  Typography,
  Badge,
  Modal,
  message,
  Dropdown,
  Menu,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.css";
import LoginModal from "../../homePage/LoginModal";
import CustomerRegisterModal from "../../homePage/CustomerRegisterModal";
import { SCREEN } from "../../../router/screen";
import { CartApi } from "../../../api/client/cart/CartApi";
import { isTokenExpired } from "../../../util/common/utils";

const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartVisible, setCartVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (token && name && email) {
      setIsLoggedIn(true);
      setUserInfo({ name, email, role });
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    setUserInfo({ name, email, role });
    setLoginModalVisible(false);

    // Navigate to admin page if user is admin
    if (role === "ADMIN" || role === "EMPLOYEE") {
      // Admin or Employee
      navigate(SCREEN.productManagement.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const refreshCartCount = async () => {
    const token = localStorage.getItem("token");
    if (isTokenExpired(token)) {
      setCartCount(0);
      return;
    }
    try {
      const { data } = await CartApi.count();
      setCartCount(Number(data) || 0);
    } catch (_) {}
  };

  const openLoginModal = () => {
    setLoginModalVisible(true);
    setRegisterModalVisible(false);
  };

  const openRegisterModal = () => {
    setRegisterModalVisible(true);
    setLoginModalVisible(false);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      Modal.confirm({
        title: "Yêu cầu đăng nhập",
        content: "Bạn cần đăng nhập để tiếp tục thanh toán.",
        okText: "Đăng nhập",
        cancelText: "Hủy",
        onOk: () => {
          setCartVisible(false);
          setLoginModalVisible(true);
        },
      });
      return;
    }
    setCartVisible(false);
    message.success("Đi tới thanh toán...");
    // TODO: điều hướng tới trang thanh toán khi có route
    // navigate('/checkout');
  };

  // Listen for global cart add events from other pages
  useEffect(() => {
    const onAdd = () => {
      refreshCartCount();
    };
    const onRefresh = () => {
      refreshCartCount();
    };
    const onOpenLogin = () => {
      setLoginModalVisible(true);
    };
    window.addEventListener("cart:add", onAdd);
    window.addEventListener("cart:refresh", onRefresh);
    window.addEventListener("open:login", onOpenLogin);
    refreshCartCount();
    return () => {
      window.removeEventListener("cart:add", onAdd);
      window.removeEventListener("cart:refresh", onRefresh);
      window.removeEventListener("open:login", onOpenLogin);
    };
  }, []);

  // No local persistence; count comes from backend

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <Title level={2} className={styles.logoText}>
                LIBRA SNEAKER
              </Title>
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>
              Trang chủ
            </Link>
            <Link to="/products" className={styles.navLink}>
              Sản phẩm
            </Link>
            <Link to="/about" className={styles.navLink}>
              Giới thiệu
            </Link>
            <Link to="/contact" className={styles.navLink}>
              Liên hệ
            </Link>
          </nav>
          <div className={styles.headerActions}>
            <div className={styles.authButtons}>
              {isLoggedIn ? (
                <div className={styles.userInfo}>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          key="profile"
                          onClick={() => navigate("/profile")}
                        >
                          Thông tin cá nhân
                        </Menu.Item>
                        <Menu.Item
                          key="orders"
                          onClick={() => navigate("/my-orders")}
                        >
                          Đơn hàng của tôi
                        </Menu.Item>
                      </Menu>
                    }
                    placement="bottomRight"
                    trigger={["click"]}
                  >
                    <Button
                      type="text"
                      icon={<UserOutlined />}
                      className={styles.userButton}
                    >
                      {userInfo?.email}
                    </Button>
                  </Dropdown>
                  {(userInfo?.role === "ADMIN" ||
                    userInfo?.role === "EMPLOYEE") && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => navigate(SCREEN.productManagement.path)}
                      className={styles.adminButton}
                    >
                      Admin Panel
                    </Button>
                  )}
                  <Button
                    type="text"
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className={styles.authButtonsGroup}>
                  <Button
                    type="text"
                    icon={<LoginOutlined />}
                    onClick={openLoginModal}
                    className={styles.loginButton}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={openRegisterModal}
                    className={styles.registerButton}
                  >
                    Đăng ký
                  </Button>
                </div>
              )}
              <Badge count={cartCount} showZero>
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  className={styles.cartButton}
                  id="header-cart-anchor"
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token || isTokenExpired(token) || !isLoggedIn) {
                      Modal.confirm({
                        title: "Yêu cầu đăng nhập",
                        content:
                          "Bạn cần đăng nhập để xem giỏ hàng và mua hàng.",
                        okText: "Đăng nhập",
                        cancelText: "Hủy",
                        onOk: () => {
                          setLoginModalVisible(true);
                        },
                      });
                      return;
                    }
                    navigate("/cart");
                  }}
                >
                  Giỏ hàng
                </Button>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onSwitchToRegister={openRegisterModal}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Register Modal */}
      <CustomerRegisterModal
        visible={registerModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        onSwitchToLogin={openLoginModal}
      />

      {/* Cart Modal removed in favor of dedicated page */}
    </>
  );
};

export default Header;
