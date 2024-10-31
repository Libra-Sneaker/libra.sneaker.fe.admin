import React, { useEffect, useState } from "react";
import { Layout, Input, Button, Modal, message } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import "./style-header.css";

const { Header } = Layout;
const { confirm } = Modal;

const HeaderComponent = ({ collapsed, toggleCollapsed }) => {
  return (
    <div className="sticky-header">
      <Header
        className={collapsed ? "collapsed" : ""}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          width: "100%",
          zIndex: 1000,
          paddingLeft: collapsed ? 80 : 250,
          top: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {!collapsed && (
            <div
              className="sidebar-toggle"
              onClick={toggleCollapsed}
              style={{
                cursor: "pointer",
                width: "32px",
                marginLeft: 20,
                marginRight: "20px",
                height: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FCA311",
                borderRadius: "50%",
                color: "#fff",
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          )}
          {collapsed && (
            <div style={{ marginLeft: 30, fontSize: 22, fontWeight: "bold" }}>
              LIBRA SNEAKER
            </div>
          )}{" "}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}></div>
      </Header>
    </div>
  );
};

export default HeaderComponent;
