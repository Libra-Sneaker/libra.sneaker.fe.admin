import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Typography, message, Spin } from "antd";
import {
  ShoppingOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import { OrderApi } from "../../../api/client/order/OrderApi";
import { isTokenExpired } from "../../../util/common/utils";
import dayjs from "dayjs";
import styles from "./MyOrder.module.css";

const { Title, Text } = Typography;

const statusMap = {
  0: { color: "orange", text: "Chờ xử lý", icon: <ClockCircleOutlined /> },
  1: { color: "green", text: "Đã thanh toán", icon: <CheckCircleOutlined /> },
  2: { color: "blue", text: "Đang giao hàng", icon: <TruckOutlined /> },
  3: { color: "purple", text: "Đã giao hàng", icon: <CheckCircleOutlined /> },
  4: { color: "red", text: "Đã hủy", icon: <CloseCircleOutlined /> },
};

const getStatusTag = (status) => {
  const info = statusMap[status] || statusMap[0];
  return (
    <Tag color={info.color} icon={info.icon}>
      {info.text}
    </Tag>
  );
};

const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "number") return dayjs(date).format("DD/MM/YYYY HH:mm");
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

const formatCurrency = (amount) => {
  if (!amount) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const MyOrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      navigate("/");
      message.warning("Vui lòng đăng nhập để xem đơn hàng");
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderApi.getMyOrders();
      setOrders(res.data || []);
    } catch (e) {
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "billCode",
      key: "billCode",
      render: (text, record) => text || record.id,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (val) => formatDate(val),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val) => formatCurrency(val),
    },
    {
      title: "Số lượng",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      render: (val) => val || 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (val) => getStatusTag(val),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (val) => (
        <>{val ? "Đã thanh toán" : "Thanh toán khi nhận hàng"}</>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/my-orders/detail/${record.id}`);
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Title level={2} className={styles.pageTitle}>
          <ShoppingOutlined /> Đơn hàng của tôi
        </Title>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          loading={loading}
          pagination={{ pageSize: 8 }}
          onRow={(record) => ({
            onClick: () => navigate(`/my-orders/detail/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>
      <Footer />
    </div>
  );
};

export default MyOrderPage;
