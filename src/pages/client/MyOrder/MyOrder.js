import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Tag,
  Button,
  Empty,
  Spin,
  Typography,
  Space,
  Divider,
  Modal,
  Timeline,
  Descriptions,
  Image,
  Row,
  Col,
  message,
  Input,
  Select,
  Popconfirm,
} from "antd";
import {
  ShoppingOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  FileTextOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import { OrderApi } from "../../../api/client/order/OrderApi";
import { CartApi } from "../../../api/client/cart/CartApi";
import { isTokenExpired } from "../../../util/common/utils";
import dayjs from "dayjs";
import styles from "./MyOrder.module.css";

const { Title, Text } = Typography;

const MyOrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [reorderingOrderId, setReorderingOrderId] = useState(null);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      navigate("/");
      message.warning("Vui lòng đăng nhập để xem đơn hàng");
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderApi.getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (billId) => {
    try {
      setDetailLoading(true);
      const response = await OrderApi.getOrderDetail(billId);
      setOrderDetail(response.data);
      setDetailModalVisible(true);
    } catch (error) {
      console.error("Error fetching order detail:", error);
      message.error("Không thể tải chi tiết đơn hàng");
    } finally {
      setDetailLoading(false);
    }
  };

  const statusOptions = [
    { value: null, label: "Tất cả trạng thái" },
    { value: 0, label: "Chờ xử lý" },
    { value: 1, label: "Đã thanh toán" },
    { value: 2, label: "Đang giao hàng" },
    { value: 3, label: "Đã giao hàng" },
    { value: 4, label: "Đã hủy" },
  ];

  const getStatusInfo = (status) => {
    const statusMap = {
      0: { color: "orange", text: "Chờ xử lý", icon: <ClockCircleOutlined /> },
      1: { color: "green", text: "Đã thanh toán", icon: <CheckCircleOutlined /> },
      2: { color: "blue", text: "Đang giao hàng", icon: <TruckOutlined /> },
      3: { color: "purple", text: "Đã giao hàng", icon: <CheckCircleOutlined /> },
      4: { color: "red", text: "Đã hủy", icon: <CloseCircleOutlined /> },
    };
    return statusMap[status] || statusMap[0];
  };

  const getStatusTag = (status) => {
    const statusInfo = getStatusInfo(status);
    return (
      <Tag color={statusInfo.color} icon={statusInfo.icon}>
        {statusInfo.text}
      </Tag>
    );
  };

  const canCancelOrder = (status) => {
    const numericStatus = Number(status);
    return numericStatus === 0 || numericStatus === 1;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      // Nếu là timestamp (milliseconds)
      if (typeof dateString === "number") {
        return dayjs(dateString).format("DD/MM/YYYY HH:mm");
      }
      // Nếu là string
      return dayjs(dateString).format("DD/MM/YYYY HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusMatches =
        statusFilter === null ||
        Number(order.status) === Number(statusFilter);

      const keyword = searchTerm.trim().toLowerCase();
      const code = order.billCode || "";
      const id = order.id || "";
      const searchMatches =
        keyword.length === 0 ||
        code.toLowerCase().includes(keyword) ||
        id.toLowerCase().includes(keyword);

      return statusMatches && searchMatches;
    });
  }, [orders, statusFilter, searchTerm]);

  const handleCancelOrder = async (billId) => {
    try {
      setCancellingOrderId(billId);
      await OrderApi.cancelOrder(billId);
      message.success("Đã hủy đơn hàng thành công");
      fetchOrders();
    } catch (error) {
      console.error("Error cancel order:", error);
      const backendMessage = error?.response?.data?.message;
      message.error(backendMessage || "Không thể hủy đơn hàng");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleReorder = async (billId) => {
    try {
      setReorderingOrderId(billId);
      const response = await OrderApi.getOrderDetail(billId);
      const details = response.data?.billDetails || [];

      if (details.length === 0) {
        message.warning("Không có sản phẩm để mua lại");
        return;
      }

      await Promise.all(
        details.map((detail) =>
          CartApi.add({
            productDetailId: detail.productDetailId,
            quantity: detail.quantity || 1,
          })
        )
      );

      message.success("Đã thêm sản phẩm vào giỏ hàng");
      navigate("/cart");
    } catch (error) {
      console.error("Error reordering:", error);
      const backendMessage = error?.response?.data?.message;
      message.error(backendMessage || "Không thể mua lại đơn hàng này");
    } finally {
      setReorderingOrderId(null);
    }
  };

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <Title level={2} className={styles.pageTitle}>
              <ShoppingOutlined /> Đơn hàng của tôi
            </Title>
            <Text type="secondary">
              Quản lý và theo dõi tất cả đơn hàng của bạn
            </Text>
          </div>
          <Space className={styles.filterBar} size="middle" wrap>
            <Input.Search
              allowClear
              placeholder="Tìm theo mã đơn"
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className={styles.filterInput}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              className={styles.filterSelect}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchOrders}
              className={styles.refreshButton}
            >
              Làm mới
            </Button>
          </Space>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className={styles.emptyCard}>
            <Empty
              description="Không tìm thấy đơn hàng phù hợp"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => navigate("/products")}>
                Mua sắm ngay
              </Button>
            </Empty>
          </Card>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className={styles.orderCard}
                hoverable
              >
                <div className={styles.orderHeader}>
                  <div>
                    <Text strong className={styles.orderCode}>
                      Mã đơn: {order.billCode || order.id}
                    </Text>
                    <div className={styles.orderDate}>
                      <Text type="secondary">
                        Ngày đặt: {formatDate(order.createdDate)}
                      </Text>
                    </div>
                  </div>
                  {getStatusTag(order.status)}
                </div>

                <Divider />

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <div className={styles.orderInfo}>
                      <Text type="secondary">Tổng tiền</Text>
                      <Text strong className={styles.orderAmount}>
                        {formatCurrency(order.totalAmount)}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <div className={styles.orderInfo}>
                      <Text type="secondary">Số lượng sản phẩm</Text>
                      <Text strong>{order.totalQuantity || 0} sản phẩm</Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <div className={styles.orderInfo}>
                      <Text type="secondary">Ngày thanh toán</Text>
                      <Text>{formatDate(order.datePayment)}</Text>
                    </div>
                  </Col>
                </Row>

                {order.address && (
                  <>
                    <Divider />
                    <div className={styles.orderInfo}>
                      <Text type="secondary">Địa chỉ giao hàng</Text>
                      <Text>{order.address}</Text>
                    </div>
                  </>
                )}

                <Divider />
                <div className={styles.orderActions}>
                  <Space size="middle" wrap>
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetail(order.id)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      type="link"
                      icon={<ShoppingOutlined />}
                      onClick={() => handleReorder(order.id)}
                      loading={reorderingOrderId === order.id}
                    >
                      Mua lại
                    </Button>
                    {canCancelOrder(order.status) && (
                      <Popconfirm
                        title="Hủy đơn hàng"
                        description="Bạn có chắc chắn muốn hủy đơn hàng này?"
                        okText="Hủy đơn"
                        cancelText="Đóng"
                        okButtonProps={{
                          danger: true,
                          loading: cancellingOrderId === order.id,
                        }}
                        onConfirm={() => handleCancelOrder(order.id)}
                      >
                        <Button
                          type="link"
                          danger
                          icon={<CloseCircleOutlined />}
                          disabled={cancellingOrderId === order.id}
                        >
                          Hủy đơn
                        </Button>
                      </Popconfirm>
                    )}
                  </Space>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            <span>Chi tiết đơn hàng</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
        centered
      >
        {detailLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : orderDetail ? (
          <div>
            {/* Thông tin đơn hàng */}
            <Descriptions
              title="Thông tin đơn hàng"
              bordered
              column={1}
              size="small"
            >
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
            </Descriptions>

            <Divider />

            {/* Danh sách sản phẩm */}
            <Title level={5}>Sản phẩm trong đơn hàng</Title>
            {orderDetail.billDetails && orderDetail.billDetails.length > 0 ? (
              <div className={styles.productList}>
                {orderDetail.billDetails.map((detail, index) => {
                  // Tìm productDetail tương ứng
                  const productDetail = orderDetail.productDetails?.find(
                    (pd) => pd.id === detail.productDetailId
                  );
                  const unitPrice = detail.price || 0;
                  const finalUnitPrice =
                    detail.finalPrice !== null && detail.finalPrice !== undefined
                      ? detail.finalPrice
                      : unitPrice;
                  const lineTotal =
                    finalUnitPrice * (detail.quantity || 0);
                  
                  return (
                    <Card
                      key={index}
                      size="small"
                      className={styles.productCard}
                      style={{ marginBottom: 12 }}
                    >
                      <Row gutter={16} align="middle">
                        <Col span={4}>
                          {productDetail?.urlImage ? (
                            <Image
                              src={productDetail.urlImage}
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
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 4,
                              }}
                            >
                              <ShoppingOutlined style={{ fontSize: 24 }} />
                            </div>
                          )}
                        </Col>
                        <Col span={14}>
                          <Text strong>
                            Mã sản phẩm: {productDetail?.productCode || detail.productDetailId}
                          </Text>
                          <div>
                            <Text type="secondary">
                              Giá niêm yết: {formatCurrency(unitPrice)}
                            </Text>
                            {finalUnitPrice !== unitPrice && (
                              <div>
                                <Text delete type="secondary" style={{ marginLeft: 8 }}>
                                  {formatCurrency(unitPrice)}
                                </Text>
                                <Text strong style={{ marginLeft: 8, color: "#ff4d4f" }}>
                                  {formatCurrency(finalUnitPrice)}
                                </Text>
                              </div>
                            )}
                          </div>
                          {detail.discountAmount && detail.discountAmount > 0 && (
                            <div>
                              <Text type="secondary" style={{ color: "#52c41a" }}>
                                Giảm giá: {formatCurrency(detail.discountAmount)}
                              </Text>
                            </div>
                          )}
                        </Col>
                        <Col span={6} style={{ textAlign: "right" }}>
                          <Text>Số lượng: {detail.quantity}</Text>
                          <div>
                            <Text strong>
                              {formatCurrency(lineTotal)}
                            </Text>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Empty description="Không có sản phẩm" />
            )}
            
            {/* Tổng tiền */}
            {orderDetail.totalAmount && (
              <>
                <Divider />
                <div style={{ textAlign: "right" }}>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    Tổng tiền:{" "}
                  </Text>
                  <Text strong style={{ fontSize: 20, color: "#1890ff" }}>
                    {formatCurrency(orderDetail.totalAmount)}
                  </Text>
                </div>
                {orderDetail.finalAmount && orderDetail.finalAmount !== orderDetail.totalAmount && (
                  <div style={{ textAlign: "right", marginTop: 8 }}>
                    <Text delete type="secondary" style={{ fontSize: 16 }}>
                      {formatCurrency(orderDetail.totalAmount)}
                    </Text>
                    <Text strong style={{ fontSize: 20, color: "#ff4d4f", marginLeft: 8 }}>
                      {formatCurrency(orderDetail.finalAmount)}
                    </Text>
                  </div>
                )}
              </>
            )}

            {/* Timeline (nếu có) */}
            {orderDetail.timeline && orderDetail.timeline.length > 0 && (
              <>
                <Divider />
                <Title level={5}>Lịch sử đơn hàng</Title>
                <Timeline>
                  {orderDetail.timeline.map((item, index) => (
                    <Timeline.Item key={index} color="blue">
                      <Text strong>
                        {item.status !== undefined
                          ? getStatusInfo(item.status).text
                          : "Cập nhật"}
                      </Text>
                      <div>
                        <Text type="secondary">
                          {formatDate(item.createdDate)}
                        </Text>
                      </div>
                      {item.note && (
                        <div>
                          <Text type="secondary">{item.note}</Text>
                        </div>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </>
            )}
          </div>
        ) : (
          <Empty description="Không có thông tin chi tiết" />
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default MyOrderPage;
