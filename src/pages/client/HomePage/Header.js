import { Button, Typography, Badge, Modal, message } from "antd";
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
import CartModal from "../Cart/CartModal";
import CustomerRegisterModal from "../../homePage/CustomerRegisterModal";
import { SCREEN } from "../../../router/screen";

const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "NIKE AIR SF AIR FORCE 1 MID MEN'S", price: 1990000, qty: 1, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=200&q=60" },
    { id: 2, name: "ADIDAS ULTRA BOOST 22", price: 2500000, qty: 2, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=200&q=60" }
  ]);
  const [cartVisible, setCartVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    
    if (token && name && email) {
      setIsLoggedIn(true);
      setUserInfo({ name, email, role });
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    setUserInfo({ name, email, role });
    setLoginModalVisible(false);
    
    // Navigate to admin page if user is admin
    if (role === 'ADMIN' || role === 'EMPLOYEE') { // Admin or Employee
      navigate(SCREEN.productManagement.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const handleAddToCart = (productId) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId);
    // demo: push item with id/price; in real app, pass actual product data
    setCartItems(prev => {
      const exist = prev.find(i => i.id === productId);
      if (exist) {
        return prev.map(i => i.id === productId ? { ...i, qty: (i.qty || 1) + 1 } : i);
      }
      return [...prev, { id: productId, name: `Sản phẩm #${productId}`, price: 100000, qty: 1 }];
    });
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

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <Title level={2} className={styles.logoText}>LIBRA SNEAKER</Title>
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Trang chủ</Link>
            <Link to="/products" className={styles.navLink}>Sản phẩm</Link>
            <a href="#collection" className={styles.navLink}>Bộ sưu tập</a>
            <a href="#contact" className={styles.navLink}>Liên hệ</a>
          </nav>
          <div className={styles.headerActions}>
            <div className={styles.authButtons}>
              {isLoggedIn ? (
                <div className={styles.userInfo}>
                  <Button 
                    type="text" 
                    icon={<UserOutlined />}
                    className={styles.userButton}
                  >
                    {userInfo?.name}
                  </Button>
                  {(userInfo?.role === 'ADMIN' || userInfo?.role === 'EMPLOYEE') && (
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
              <Badge count={cartItems.reduce((sum,i)=>sum+(i.qty||1),0)} showZero>
                <Button 
                  type="text" 
                  icon={<ShoppingCartOutlined />}
                  className={styles.cartButton}
                  onClick={() => setCartVisible(true)}
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

      {/* Cart Modal */}
      <CartModal
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        items={cartItems}
        onChangeQty={(id, qty) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))}
        onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
        onCheckout={handleCheckout}
      />
    </>
  );
};

export default Header;
