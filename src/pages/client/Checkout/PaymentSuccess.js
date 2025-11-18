import React from "react";
import { Button, Typography, Result } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.css";

const { Title, Text } = Typography;

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.layout} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className={styles.container} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Result
          status="success"
          title={<Title level={2} style={{ color: "#1890ff", marginBottom: 8 }}>Thanh toán thành công!</Title>}
          subTitle={
            <div style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 18, color: "#333" }}>
                Cảm ơn bạn đã mua hàng tại <span style={{ color: "#1890ff", fontWeight: 600 }}>Libra Sneaker</span>!<br />
                Đơn hàng của bạn đã được thanh toán thành công qua VNPay.<br />
                Chúng tôi sẽ liên hệ và giao hàng trong thời gian sớm nhất.
              </Text>
            </div>
          }
          extra={[
            <Button type="primary" size="large" onClick={() => navigate("/")}>Về trang chủ</Button>,
            <Button size="large" style={{ marginLeft: 8 }} onClick={() => navigate("/profile")}>Xem đơn hàng</Button>
          ]}
        />
      </div>
      <footer style={{ textAlign: "center", padding: 24, background: "#fff", borderTop: "1px solid #eee" }}>
        Libra Sneaker &copy; {new Date().getFullYear()} - Cảm ơn bạn đã tin tưởng!
      </footer>
    </div>
  );
};

export default PaymentSuccess;
