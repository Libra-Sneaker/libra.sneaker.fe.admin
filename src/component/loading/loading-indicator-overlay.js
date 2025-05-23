import React from "react";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const LoadingIndicatorOverlay = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(66, 66, 66, 0.475)",
      zIndex: 99999999999,
    }}
  >
    <Spin
      indicator={<Loading3QuartersOutlined style={{ fontSize: 36 }} spin />}
    />{" "}
    <br />
    <span style={{ marginLeft: "10px", color: "white", fontSize: "15px" }}>
      Vui lòng chờ ...
    </span>
  </div>
);

export default LoadingIndicatorOverlay;
