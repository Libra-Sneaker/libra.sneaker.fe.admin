import React, { useEffect, useState } from "react";
import {
  Typography,
  Descriptions,
  Steps,
  Image,
  Tag,
  Spin,
  message,
  Button,
} from "antd";
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

const statusSteps = [
  { status: 0, title: "Đã đặt hàng thành công", icon: <ClockCircleOutlined /> },
  { status: 0, title: "Đang chờ vận chuyển", icon: <ClockCircleOutlined /> },
  { status: 2, title: "Đang giao hàng", icon: <TruckOutlined /> },
  { status: 3, title: "Đã hoàn thành", icon: <CheckCircleOutlined /> },
];

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

  // Chuẩn bị dữ liệu cho Steps (timeline trạng thái)
  const getStepsItems = () => {
    if (orderDetail?.timeline && orderDetail.timeline.length > 0) {
      // Có timeline, hiển thị theo timeline
      const sortedTimeline = [...orderDetail.timeline].sort(
        (a, b) => a.status - b.status
      );
      return sortedTimeline.map((item) => {
        const statusInfo = statusMap[item.status] || {};
        return {
          title: statusInfo.text || "Cập nhật",
          description: (
            <>
              <div>{dayjs(item.createdDate).format("DD/MM/YYYY HH:mm:ss")}</div>
              {item.note && <div>{item.note}</div>}
            </>
          ),
          icon: statusInfo.icon,
        };
      });
    } else if (orderDetail?.bill) {
      // Không có timeline, hiển thị trạng thái hiện tại
      const status = orderDetail.bill.status;
      const statusInfo = statusMap[status] || {};
      return [
        {
          title: statusInfo.text || "Trạng thái đơn hàng",
          description: (
            <>
              <div>
                {orderDetail.bill.createdDate
                  ? dayjs(orderDetail.bill.createdDate).format(
                      "DD/MM/YYYY HH:mm"
                    )
                  : ""}
              </div>
            </>
          ),
          icon: statusInfo.icon,
        },
      ];
    }
    return [];
  };

  // Steps tiến trình trạng thái đơn hàng
  const getOrderProcessSteps = () => {
    if (!orderDetail?.bill) return [];
    const currentStatus = orderDetail.bill.status;
    // Nếu bị hủy thì chỉ hiển thị đến trạng thái "Đã hủy"
    const steps =
      currentStatus === 4 ? statusSteps.slice(0, 4) : statusSteps.slice(0, 4);

    return steps.map((step, idx) => {
      let stepStatus = "wait";
      if (step.status < currentStatus) stepStatus = "finish";
      else if (step.status === currentStatus) stepStatus = "process";

      // Icon sáng cho finish/process, mờ cho wait
      let icon = step.icon;
      if (stepStatus === "wait") {
        // Clone icon với màu xám
        icon = React.cloneElement(step.icon, { style: { color: "#bfbfbf" } });
      } else if (stepStatus === "finish" || stepStatus === "process") {
        icon = React.cloneElement(step.icon, { style: { color: "#1677ff" } });
      }

      // Hiển thị ngày cho các bước đã qua hoặc hiện tại
      let dateStr = "";
      if (orderDetail.timeline && orderDetail.timeline.length > 0) {
        const timelineItem = orderDetail.timeline.find(
          (t) => t.status === step.status
        );
        if (timelineItem && timelineItem.createdDate) {
          dateStr = dayjs(timelineItem.createdDate).format(
            "DD/MM/YYYY HH:mm:ss"
          );
        }
      } else if (step.status === 0 && orderDetail.bill.createdDate) {
        dateStr = dayjs(orderDetail.bill.createdDate).format(
          "DD/MM/YYYY HH:mm:ss"
        );
      } else if (step.status === 3 && orderDetail.bill.datePayment) {
        dateStr = dayjs(orderDetail.bill.datePayment).format(
          "DD/MM/YYYY HH:mm:ss"
        );
      }

      return {
        title: step.title,
        icon,
        status: stepStatus,
        description: dateStr,
      };
    });
  };

  return (
    <div>
      <Header />
      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: 24, marginTop: 70 }}
      >
        <Button
          type="link"
          onClick={() => navigate("/my-orders")}
          style={{ marginBottom: 16 }}
        >
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
            {/* Status Steps Timeline */}
            <div style={{ marginBottom: 32 }}>
              <Steps
                direction="horizontal"
                size="default"
                current={
                  orderDetail.bill.status === 4
                    ? 4
                    : Math.min(orderDetail.bill.status, 3)
                }
                items={getOrderProcessSteps()}
              />
            </div>
            {/* Order Info */}
            <Descriptions
              bordered
              column={1}
              size="small"
              title="Thông tin đơn hàng"
            >
              <Descriptions.Item label="Mã đơn hàng">
                {orderDetail.bill?.billCode || orderDetail.bill?.id}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {statusMap[orderDetail.bill?.status]?.text || "Không xác định"}
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
              {orderDetail.bill?.isPaid && (
                <Descriptions.Item label="Trạng thái thanh toán">
                  {orderDetail.bill.isPaid
                    ? "Đã thanh toán"
                    : "Thanh toán khi nhận hàng"}
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
                          Mã sản phẩm:{" "}
                          {pd?.productCode || detail.productDetailId}
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
                        <div>
                          <Text>Số lượng: {detail.quantity}</Text>
                        </div>
                        <div>
                          <Text strong>
                            Thành tiền:{" "}
                            {formatCurrency(
                              (detail.finalPrice ?? detail.price) *
                                (detail.quantity || 0)
                            )}
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
