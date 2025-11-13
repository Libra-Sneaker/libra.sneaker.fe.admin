import React, { useEffect, useState } from "react";
import { Typography, Descriptions, Timeline, Image, Tag, Spin, message, Button } from "antd";
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { OrderApi } from "../../../api/client/order/OrderApi";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";

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
    <Tag color={info.color} icon={info.icon} style={{ fontSize: 16, padding: "4px 12px" }}>
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

const DetailOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    OrderApi.getOrderDetail(id)
      .then((res) => setOrderDetail(res.data))
      .catch(() => {
        message.error("Không thể tải chi tiết đơn hàng");
        setOrderDetail(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <Button type="link" onClick={() => navigate("/my-orders")} style={{ marginBottom: 16 }}>
          ← Quay lại danh sách đơn hàng
        </Button>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : !orderDetail ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Text type="secondary">Không có thông tin chi tiết</Text>
          </div>
        ) : (
          <>
            {/* Status on top */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {getStatusTag(orderDetail.bill?.status)}
            </div>
            {/* Timeline */}
            {orderDetail.timeline && orderDetail.timeline.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <Title level={5}>Lịch sử đơn hàng</Title>
                <Timeline>
                  {orderDetail.timeline.map((item, idx) => (
                    <Timeline.Item key={idx} color="blue">
                      <Text strong>
                        {item.status !== undefined
                          ? statusMap[item.status]?.text || "Cập nhật"
                          : "Cập nhật"}
                      </Text>
                      <div>
                        <Text type="secondary">{formatDate(item.createdDate)}</Text>
                      </div>
                      {item.note && (
                        <div>
                          <Text type="secondary">{item.note}</Text>
                        </div>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
            {/* Order Info */}
            <Descriptions bordered column={1} size="small" title="Thông tin đơn hàng">
              <Descriptions.Item label="Mã đơn hàng">
                {orderDetail.bill?.billCode || orderDetail.bill?.id}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(orderDetail.bill?.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                {formatCurrency(orderDetail.bill?.totalAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {formatDate(orderDetail.bill?.createdDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày thanh toán">
                {formatDate(orderDetail.bill?.datePayment)}
              </Descriptions.Item>
              {orderDetail.bill?.address && (
                <Descriptions.Item label="Địa chỉ giao hàng">
                  {orderDetail.bill.address}
                </Descriptions.Item>
              )}
              {orderDetail.bill?.recipient && (
                <Descriptions.Item label="Người nhận">
                  {orderDetail.bill.recipient}
                </Descriptions.Item>
              )}
              {orderDetail.bill?.phonenumber && (
                <Descriptions.Item label="SĐT">
                  {orderDetail.bill.phonenumber}
                </Descriptions.Item>
              )}
            </Descriptions>
            {/* Product List */}
            <div style={{ margin: "16px 0" }}>
              <Title level={5}>Sản phẩm trong đơn hàng</Title>
              {(orderDetail.billDetails || []).map((detail, idx) => {
                const pd = (orderDetail.productDetails || []).find(
                  (p) => p.id === detail.productDetailId
                );
                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: 12,
                      border: "1px solid #f0f0f0",
                      borderRadius: 6,
                      padding: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: 16 }}>
                        {pd?.urlImage ? (
                          <Image
                            src={pd.urlImage}
                            alt="Sản phẩm"
                            width={80}
                            height={80}
                            style={{ objectFit: "cover", borderRadius: 4 }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 80,
                              height: 80,
                              background: "#f0f0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 4,
                            }}
                          >
                            <ShoppingOutlined style={{ fontSize: 24 }} />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text strong>
                          Mã sản phẩm: {pd?.productCode || detail.productDetailId}
                        </Text>
                        <div>
                          <Text type="secondary">
                            Giá niêm yết: {formatCurrency(detail.price)}
                          </Text>
                          {detail.finalPrice !== null &&
                            detail.finalPrice !== undefined &&
                            detail.finalPrice !== detail.price && (
                              <span>
                                <Text
                                  delete
                                  type="secondary"
                                  style={{ marginLeft: 8 }}
                                >
                                  {formatCurrency(detail.price)}
                                </Text>
                                <Text
                                  strong
                                  style={{ marginLeft: 8, color: "#ff4d4f" }}
                                >
                                  {formatCurrency(detail.finalPrice)}
                                </Text>
                              </span>
                            )}
                        </div>
                        {detail.discountAmount && detail.discountAmount > 0 && (
                          <div>
                            <Text type="secondary" style={{ color: "#52c41a" }}>
                              Giảm giá: {formatCurrency(detail.discountAmount)}
                            </Text>
                          </div>
                        )}
                        <div>
                          <Text>Số lượng: {detail.quantity}</Text>
                        </div>
                        <div>
                          <Text strong>
                            Thành tiền: {formatCurrency((detail.finalPrice ?? detail.price) * (detail.quantity || 0))}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DetailOrder;
