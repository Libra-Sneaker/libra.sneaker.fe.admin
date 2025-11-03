import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Form, Input, Radio, Row, Tag, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import { CartApi } from "../../../api/client/cart/CartApi";
import styles from "./CheckoutPage.module.css";

const { Text, Title } = Typography;

const money = (v) => (v || 0).toLocaleString() + " đ";

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const loadCart = async () => {
    try {
      const { data } = await CartApi.list();
      const mapped = (data || []).map(it => ({
        id: it.cartDetailId || it.productDetailId,
        productDetailId: it.productDetailId,
        name: it.productName,
        price: it.price,
        qty: it.quantity,
        image: it.urlImg || it.image || "",
      }));
      setItems(mapped);
    } catch (_) {
      setItems([]);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const subtotal = items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0);
  const shippingFee = 34000;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  const onFinish = async (values) => {
    if (items.length === 0) {
      message.error("Giỏ hàng trống");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call checkout API
      message.success("Đặt hàng thành công!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      message.error("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Title level={2} style={{ marginBottom: 24 }}>Thanh toán</Title>

        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={24}>
            {/* Left Column: Delivery Information & Payment */}
            <Col xs={24} md={16}>
              {/* Delivery Information Section */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <Title level={4} style={{ margin: 0 }}>Thông tin giao hàng</Title>
                  <Button type="text" size="small">CHỌN ĐỊA CHỈ</Button>
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <Form.Item name="fullName" label={<Text strong>Họ và tên <span style={{ color: 'red' }}>*</span></Text>}>
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item name="phone" label={<Text strong>Số điện thoại <span style={{ color: 'red' }}>*</span></Text>}>
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="province" label={<Text strong>Tỉnh/thành phố <span style={{ color: 'red' }}>*</span></Text>}>
                      <Input placeholder="Chọn tỉnh/thành" />
                    </Form.Item>
                  </Col>
                  {/* <Col span={8}>
                    <Form.Item name="district" label={<Text strong>Quận/huyện <span style={{ color: 'red' }}>*</span></Text>}>
                      <Input placeholder="Chọn quận/huyện" />
                    </Form.Item>
                  </Col> */}
                  <Col span={8}>
                    <Form.Item name="ward" label={<Text strong>Xã/thị trấn <span style={{ color: 'red' }}>*</span></Text>}>
                      <Input placeholder="Chọn xã/thị trấn" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="address" label={<Text strong>Địa chỉ cụ thể <span style={{ color: 'red' }}>*</span></Text>}>
                  <Input placeholder="Nhập địa chỉ cụ thể" />
                </Form.Item>
                <Form.Item name="notes" label={<Text strong>Ghi chú</Text>}>
                  <Input.TextArea rows={3} placeholder="Nhập ghi chú đơn hàng..." />
                </Form.Item>
              </div>

              {/* Payment Method Section */}
              <div className={styles.card}>
                <Title level={4} style={{ margin: 0 }}>Phương thức thanh toán</Title>
                <Divider style={{ margin: '16px 0' }} />
                <Radio.Group value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <div className={styles.paymentOption}>
                    <Radio value="cash" className={styles.radioCustom}>
                      <div className={styles.paymentContent}>
                        <Text strong>Thanh toán khi nhận hàng</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Thanh toán bằng tiền mặt khi nhận hàng</Text>
                      </div>
                    </Radio>
                  </div>
                  <div className={styles.paymentOption}>
                    <Radio value="now" className={styles.radioCustom}>
                      <div className={styles.paymentContent}>
                        <Text strong>Thanh toán ngay</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Thanh toán qua ví điện tử/Thẻ</Text>
                      </div>
                    </Radio>
                  </div>
                </Radio.Group>
              </div>

              {/* Complete Order Button */}
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                block
                className={styles.completeButton}
              >
                HOÀN THÀNH ĐẶT HÀNG
              </Button>
            </Col>

            {/* Right Column: Order Summary */}
            <Col xs={24} md={8}>
              <div className={styles.summaryCard}>
                {items.map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    {item.image && (
                      <img src={item.image} alt={item.name} className={styles.summaryImage} />
                    )}
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ display: 'block', marginBottom: 4 }}>{item.name}</Text>
                      <Tag color="orange">size: 42</Tag>
                      <div>
                        <Text type="danger" strong>{money(item.price)}</Text>
                      </div>
                    </div>
                  </div>
                ))}

                <Divider style={{ margin: '16px 0' }} />

                <div className={styles.discountSection}>
                  <Text strong>Phiếu giảm giá</Text>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Input
                      placeholder="Nhập mã"
                      value={discountCode}
                      onChange={e => setDiscountCode(e.target.value)}
                    />
                    <Button type="primary">CHỌN</Button>
                  </div>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div className={styles.costBreakdown}>
                  <div className={styles.costRow}>
                    <Text>Phí vận chuyển</Text>
                    <Text type="danger">{money(shippingFee)}</Text>
                  </div>
                  <div className={styles.costRow}>
                    <Text>Giảm giá</Text>
                    <Text type="danger">{money(discount)}</Text>
                  </div>
                  <div className={styles.costRow}>
                    <Text>Ngày nhận dự kiến</Text>
                    <Text type="danger">23-12-2023</Text>
                  </div>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div className={styles.totalSection}>
                  <Text strong style={{ fontSize: 16 }}>Tổng số tiền</Text>
                  <Text strong type="danger" style={{ fontSize: 18 }}>{money(total)}</Text>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

