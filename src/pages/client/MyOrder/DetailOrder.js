import React, { useEffect, useState } from "react";
import {
  Typography,
  Descriptions,
  Steps,
  Image,
  Spin,
  message,
  Button,
  Modal,
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

const formatDate = (date) => {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

const formatCurrency = (amount) => {
  if (!amount) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const hotline = "09xx.xxx.xxx";

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

  const getTimelineSteps = () => {
    if (!orderDetail?.timeline) return [];
    const sorted = [...orderDetail.timeline].sort(
      (a, b) => a.status - b.status
    );
    return sorted.map((item) => {
      const sInfo = statusMap[item.status] || {};
      return {
        title: sInfo.text || "Cập nhật",
        icon: sInfo.icon,
        description: (
          <>
            <div>{dayjs(item.createdDate).format("DD/MM/YYYY HH:mm:ss")}</div>
            {item.note && <div>{item.note}</div>}
          </>
        ),
      };
    });
  };

  const getOrderProcessSteps = () => {
    if (!orderDetail?.bill) return [];

    if (orderDetail.bill.status === 4) return [];

    const steps = [
      { status: 0, title: "Đã đặt hàng", icon: <ClockCircleOutlined /> },
      { status: 1, title: "Đã thanh toán", icon: <CheckCircleOutlined /> },
      { status: 2, title: "Đang giao hàng", icon: <TruckOutlined /> },
      { status: 3, title: "Hoàn thành", icon: <CheckCircleOutlined /> },
    ];

    const current = orderDetail.bill.status;

    return steps.map((step) => {
      let type = "wait";
      if (step.status < current) type = "finish";
      else if (step.status === current) type = "process";

      const iconColor = type === "wait" ? "#bfbfbf" : "#1677ff";
      const icon = React.cloneElement(step.icon, {
        style: { color: iconColor },
      });

      let dateStr = "";
      const t = orderDetail.timeline?.find((x) => x.status === step.status);
      if (t?.createdDate) {
        dateStr = dayjs(t.createdDate).format("DD/MM/YYYY HH:mm:ss");
      }

      return {
        title: step.title,
        status: type,
        icon,
        description: dateStr,
      };
    });
  };

  const handleCancelOrder = () => {
    if (orderDetail.bill.isPaid) {
      Modal.info({
        title: "Hướng dẫn hủy đơn hàng",
        content: (
          <div>
            Đơn hàng đã thanh toán online.
            <br />
            Vui lòng liên hệ Hotline/Zalo <b>{hotline}</b>.
          </div>
        ),
        okText: "Đã hiểu",
      });
      return;
    }

    Modal.confirm({
      title: "Xác nhận hủy đơn hàng",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này?",
      okText: "Hủy đơn",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          await OrderApi.cancelCashBill({ billId: orderDetail.bill.id });
          message.success("Đã hủy đơn hàng.");
          navigate("/my-orders");
        } catch {
          message.error("Hủy đơn hàng thất bại.");
        }
      },
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

        {!loading && orderDetail?.bill?.status === 0 && (
          <Button
            danger
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={handleCancelOrder}
          >
            Hủy đơn hàng
          </Button>
        )}

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
            <div style={{ marginBottom: 32 }}>
              <Steps
                direction="horizontal"
                size="default"
                items={
                  orderDetail.bill.status === 4
                    ? getTimelineSteps()
                    : getOrderProcessSteps()
                }
              />
            </div>

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
                {statusMap[orderDetail.bill?.status]?.text}
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
                <Descriptions.Item label="Địa chỉ">
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
              {orderDetail.bill?.isPaid != null && (
                <Descriptions.Item label="Thanh toán">
                  {orderDetail.bill.isPaid ? "Đã thanh toán" : "COD"}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div style={{ margin: "16px 0" }}>
              <Title level={5}>Sản phẩm</Title>
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
                            {formatCurrency(detail.price)}
                          </Text>
                          {detail.finalPrice != null &&
                            detail.finalPrice !== detail.price && (
                              <>
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
                              </>
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
                                detail.quantity
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
