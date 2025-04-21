import React, { useEffect, useState } from "react";
import { Layout, Menu, Modal } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCarTunnel,
  faCogs,
  faShoePrints,
  faShop,
  faShoppingCart,
  faSignOutAlt,
  faTrademark,
  faChartSimple,
  faReply,
  faUser,
  faTags,
  faFileAlt,
  faTag,
  faMoneyCheck,
} from "@fortawesome/free-solid-svg-icons";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import "./style-sidebar.css";
import { useAppDispatch } from "../../app/hook";
import { logout } from "../../util/auth";

const { Sider } = Layout;

const SidebarComponent = ({ collapsed, toggleCollapsed }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location]);

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đăng xuất",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        logout(navigate); // Gọi hàm logout
      },
    });
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme={collapsed ? "dark" : "light"}
      className="sidebar"
      width={250}
      style={{
        overflow: "auto",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10000,
        color: "white",
        transition: "0.25s",
        backgroundColor: "#14213d",
      }}
    >
      <Menu
        theme={collapsed ? "dark" : "light"}
        mode="inline"
        style={{ color: "white", paddingBottom: 80 }}
        selectedKeys={[selectedKey]} // Đổi thành mảng để chỉ định mục được chọn
      >
        {!collapsed && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                marginBottom: 30,
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                marginTop: 10,
                textShadow: "3px 3px 4px #e38e02",
              }}
            >
              LIBRA SNEAKER
            </div>
            <Link to={`/admin/fund-management`}>
              <img src="" alt="" width="40%" className="logo-tct-fund" />
            </Link>
          </div>
        )}
        {collapsed && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginTop: 5,
                marginBottom: 20,
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={toggleCollapsed}
            >
              <MenuUnfoldOutlined />
            </div>
            <img src="" alt="" width="60%" />
          </div>
        )}

        <Menu.Item
          // key="/brand-management"
          className="menu_custom"
          style={{ color: "white" }}
          icon={<FontAwesomeIcon icon={faChartSimple} />}
        >
          <Link to="/analysis-management">Thống kê</Link>
        </Menu.Item>

        <Menu.Item
          // key="/brand-management"
          className="menu_custom"
          style={{ color: "white" }}
          icon={<FontAwesomeIcon icon={faShoppingCart} />}
        >
          <Link to="/counter-sale-management">Bán hàng tại quầy</Link>
        </Menu.Item>

        <Menu.Item
          // key="/brand-management"
          className="menu_custom"
          style={{ color: "white" }}
          icon={<FontAwesomeIcon icon={faFileAlt} />}
        >
          <Link to="/bill-management">Quản lý hóa đơn</Link>
        </Menu.Item>

        <Menu.SubMenu
          key="/product-management-options"
          title="Quản lý sản phẩm"
          icon={<FontAwesomeIcon icon={faShop} />}
          style={{ color: "white" }}
        >
          <Menu.Item
            key="/product-management" // Đảm bảo rằng key này là duy nhất cho sản phẩm
            className="menu_custom"
            style={{ color: "white" }}
            icon={<FontAwesomeIcon icon={faShop} />}
          >
            <Link to="/product-management">Sản phẩm</Link>
          </Menu.Item>

          <Menu.Item
            key="/brand-management" // Chọn một key khác cho mục thứ hai
            className="menu_custom"
            style={{ color: "white" }}
            icon={<FontAwesomeIcon icon={faTrademark} />}
          >
            <Link to="/brand-management">Thương hiệu</Link>
          </Menu.Item>

          <Menu.Item
            key="/material-management" // Chọn một key khác cho mục thứ hai
            className="menu_custom"
            style={{ color: "white" }}
            icon={<FontAwesomeIcon icon={faCogs} />}
          >
            <Link to="/material-management">Chất liệu</Link>
          </Menu.Item>

          <Menu.Item
            key="/type-of-shoe-management"
            className="menu_custom"
            style={{ color: "white" }}
            icon={<FontAwesomeIcon icon={faBox} />}
          >
            <Link to="/type-of-shoe-management">Loại giày</Link>
          </Menu.Item>
        </Menu.SubMenu>

        {/* Account Management */}
        <Menu.SubMenu
          key="/account-management-options"
          title="Tài khoản"
          icon={<FontAwesomeIcon icon={faUser} />}
          style={{ color: "white" }}
        >
          <Menu.Item
            key="/employee-management"
            className="menu_custom"
            style={{ color: "white" }}
            icon={<FontAwesomeIcon icon={faUser} />}
          >
            <Link to="/employee-management">Quản lý nhân viên</Link>
          </Menu.Item>

          <Menu.Item
            key="/customer-management"
            className="menu_custom"
            style={{ color: "white" }}
            icon={<FontAwesomeIcon icon={faUser} />}
          >
            <Link to="/customer-management">Quản lý khách hàng</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          // key="/brand-management"
          className="menu_custom"
          style={{ color: "white" }}
          icon={<FontAwesomeIcon icon={faReply} />}
        >
          <Link to="/return-management">Trả hàng</Link>
        </Menu.Item>

        {/* <Menu.Item
          // key="/brand-management"
          className="menu_custom"
          style={{ color: "white" }}
          icon={<FontAwesomeIcon icon={faTags} />}
        >
          <Link to="/promotion-management">Khuyến mãi</Link>
        </Menu.Item> */}

        {/* Promotion Management */}
        <Menu.SubMenu
          key="/promotion-management-options"
          title="Khuyến mãi"
          icon={
            <FontAwesomeIcon style={{ color: "white" }} icon={faMoneyCheck} />
          }
          style={{ color: "white" }}
        >
          <Menu.Item
            key="/promotion-management"
            className="menu_custom"
            style={{ color: "white" }}
            icon={<FontAwesomeIcon icon={faTag} />}
          >
            <Link to="/promotion-management">Mã khuyến mãi </Link>
          </Menu.Item>

          <Menu.Item
            key="/big-promotion-management"
            className="menu_custom"
            style={{ color: "white" }}
            icon={<FontAwesomeIcon icon={faUser} />}
          >
            <Link to="/big-promotion-management">Đợt khuyến mãi </Link>
          </Menu.Item>
        </Menu.SubMenu>

        {/* Nút Đăng xuất */}
        <Menu.Item
          key="logout"
          className="menu_custom"
          style={{ color: "white", marginTop: "auto" }}
          icon={<FontAwesomeIcon icon={faSignOutAlt} />}
          onClick={handleLogout}
        >
          Đăng xuất
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;
