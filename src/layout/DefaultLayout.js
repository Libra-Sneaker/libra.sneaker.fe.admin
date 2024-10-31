import React, { useState } from "react";
import { Layout, Space } from "antd";
import "./style-default-layout.css";
import { useAppDispatch, useAppSelector } from "../app/hook";
import {
  GetAdCollapsed,
  Toggle,
} from "../app/reducer/admin/AdCollapsedSlice.reducer";
import SidebarComponent from "./sidebar/SidebarComponent";
import HeaderComponent from "./header/HeaderComponent";
import FooterComponent from "./footer/FooterComponent";

const { Content, Sider } = Layout;

const DefaultLayout = ({ children }) => {
  const collapsed = useAppSelector(GetAdCollapsed);
  const dispatch = useAppDispatch();

  const toggleCollapsed = () => {
    dispatch(Toggle(!collapsed));
  };

  document.querySelector("body").style.backgroundImage = "url()";

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
      <Layout className="adminLayout" style={{ backgroundColor: "white" }}>
        <Sider
          width={250}
          collapsed={collapsed}
          style={{
            height: "calc(100vh)",
            position: "fixed",
            left: 0,
            bottom: 0,
            backgroundColor: "#14213D",
          }}
        >
          <SidebarComponent
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
          />
        </Sider>
        <Layout
          style={{
            transition: "margin-left 0.2s",
            minHeight: "100vh",
          }}
        >
          <HeaderComponent
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
          />
          <Content
            style={{
              marginLeft: collapsed ? 80 : 250,
              backgroundColor: "#f8f8f8",
              minHeight: "calc(100vh)",
              padding: 30,
              paddingTop: 55,
              transition: "0.25s",
            }}
          >
            {children}{" "}
            <div style={{ marginTop: 50 }}>
              <FooterComponent />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Space>
  );
};

export default DefaultLayout;
