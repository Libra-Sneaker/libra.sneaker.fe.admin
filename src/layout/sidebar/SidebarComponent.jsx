import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCarTunnel,
  faCogs,
  faShoePrints,
  faShop,
  faTrademark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import "./style-sidebar.css";
import { useAppDispatch } from "../../app/hook";

const { Sider } = Layout;

const SidebarComponent = ({ collapsed, toggleCollapsed }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location]);

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
          icon={<FontAwesomeIcon icon={faCarTunnel} />}
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
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;
