import { Button, Card, Col, Layout, Rate, Row, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SCREEN } from "../../router/screen";
import Header from "./header/Header";
import LoginModal from "./LoginModal";
import anhGiay from "../../assets/img/anhGiay.png";
import jd1 from "../../assets/img/jd1.png";
import banner from "../../assets/img/banner1.jpg";
import keGiay from "../../assets/img/keGiay.jpg";
import bieuDo from "../../assets/img/bieuDo.jpg";
import mayTinhTien from "../../assets/img/mayTinhTien.jpg";

const { Content } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng ngay
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Header />
      {/* Welcome Section */}
      <Content
        style={{
          padding: "220px 100px",
          backgroundImage: `url(${banner})`, // Thêm hình nền
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "left",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Title
          level={1}
          style={{
            color: "#fff",
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          Chào mừng đến với <br /> LibraSneaker
        </Title>
        {/* <Text style={{ color: "#fff", fontSize: 18, opacity: 0.8 }}>
          Tạo website chuyên nghiệp với trình kéo thả đơn giản
        </Text> */}
      </Content>
      <Content
        style={{
          padding: "80px 100px",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <Title
          level={2}
          style={{
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 10,
            color: "#000",
            marginTop: 0,
          }}
        >
          Tin tức chính
        </Title>
        <div
          style={{
            width: 50,
            height: 2,
            backgroundColor: "#1a2a6c",
            margin: "0 auto 40px",
          }}
        />
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <div style={{ textAlign: "left" }}>
              <Title level={4} style={{ color: "#000", marginBottom: 10 }}>
                Quản lý tồn kho
              </Title>
              <img
                src={keGiay}
                alt="Quản lý tồn kho"
                style={{
                  width: "100%",
                  height: 200, // Điều chỉnh chiều cao hình ảnh
                  objectFit: "cover", // Đảm bảo hình ảnh không bị méo
                  borderRadius: 8, // Bo góc hình ảnh
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=Quản+lý+tồn+kho"; // Placeholder nếu hình ảnh không tải được
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div style={{ textAlign: "left" }}>
              <Title level={4} style={{ color: "#000", marginBottom: 10 }}>
                Bán hàng nhanh
              </Title>
              <img
                src={mayTinhTien}
                alt="Bán hàng nhanh"
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=Bán+hàng+nhanh";
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div style={{ textAlign: "left" }}>
              <Title level={4} style={{ color: "#000", marginBottom: 10 }}>
                Báo cáo doanh thu
              </Title>
              <img
                src={bieuDo}
                alt="Báo cáo doanh thu"
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=Báo+cáo+doanh+thu";
                }}
              />
            </div>
          </Col>
        </Row>
      </Content>
      {/* Contact Section */}
      <Content
        id="contact-section"
        style={{
          padding: "80px 100px",
          backgroundColor: "#fff",
        }}
      >
        <Title
          level={2}
          style={{
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 10,
            color: "#000",
            textAlign: "left",
          }}
        >
          Liên hệ với chúng tôi
        </Title>
        <div
          style={{
            width: 50,
            height: 2,
            backgroundColor: "#1a2a6c",
            marginBottom: 40,
          }}
        />
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12}>
            <div style={{ textAlign: "left" }}>
              <Title level={4} style={{ color: "#000", marginBottom: 10 }}>
                Địa chỉ
              </Title>
              <Text
                style={{
                  color: "#666",
                  fontSize: 16,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                Tòa Peakview, 36 Hoàng Cầu, P. Ô Chợ Dừa, Q. Đống Đa, Hà Nội
              </Text>
              <Title level={4} style={{ color: "#000", marginBottom: 10 }}>
                Liên hệ
              </Title>
              <Text style={{ color: "#666", fontSize: 16, display: "block" }}>
                <span role="img" aria-label="phone">
                  📞
                </span>{" "}
                012 3344 566
              </Text>
              <Text
                style={{
                  color: "#666",
                  fontSize: 16,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                <span role="img" aria-label="email">
                  📧
                </span>{" "}
                support@tempi.vn
              </Text>
              <Space size="large">
                <Button
                  type="link"
                  href="https://facebook.com"
                  target="_blank"
                  style={{ padding: 0 }}
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/facebook-new.png"
                    alt="Facebook"
                    style={{ width: 32, height: 32 }}
                  />
                </Button>
                <Button
                  type="link"
                  href="https://youtube.com"
                  target="_blank"
                  style={{ padding: 0 }}
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/youtube-play.png"
                    alt="YouTube"
                    style={{ width: 32, height: 32 }}
                  />
                </Button>
                <Button
                  type="link"
                  href="https://tiktok.com"
                  target="_blank"
                  style={{ padding: 0 }}
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/tiktok.png"
                    alt="TikTok"
                    style={{ width: 32, height: 32 }}
                  />
                </Button>
                <Button
                  type="link"
                  href="https://instagram.com"
                  target="_blank"
                  style={{ padding: 0 }}
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/instagram-new.png"
                    alt="Instagram"
                    style={{ width: 32, height: 32 }}
                  />
                </Button>
                <Button
                  type="link"
                  href="https://zalo.me"
                  target="_blank"
                  style={{ padding: 0 }}
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/zalo.png"
                    alt="Zalo"
                    style={{ width: 32, height: 32 }}
                  />
                </Button>
              </Space>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096365576614!2d105.824964315402!3d21.028511985998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4c4e986b1b%3A0x6e6e8b5b5b5b5b5b!2sPeakview%20Tower!5e0!3m2!1sen!2s!4v1698765432100!5m2!1sen!2s"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: 10 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomePage;
