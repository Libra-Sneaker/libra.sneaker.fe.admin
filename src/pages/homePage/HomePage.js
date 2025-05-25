import { Button, Card, Col, Layout, Row, Space, Typography, Statistic, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header/Header";
import {
  ShoppingCartOutlined,
  BarChartOutlined,
  TeamOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RocketOutlined,
  SafetyOutlined,
  GlobalOutlined,
  CustomerServiceOutlined,
  ShoppingOutlined,
  TagsOutlined,
  HistoryOutlined,
  UserOutlined,
  ArrowUpOutlined as UpOutlined,
} from "@ant-design/icons";
import styles from "./HomePage.module.css";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 1250000000,
    totalOrders: 1500,
    totalCustomers: 2500,
    totalProducts: 500,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowScrollTop(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Layout className={styles.layout}>
      <Header />
      
      {/* Hero Section */}
      <Content id="hero-section" className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Title className={styles.heroTitle}>
              Quản lý cửa hàng <br /> 
              <span className={styles.highlight}>Sneaker</span>
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              Giải pháp quản lý cửa hàng giày sneaker toàn diện. 
              Tối ưu hóa quy trình bán hàng, quản lý tồn kho và chăm sóc khách hàng một cách chuyên nghiệp.
            </Paragraph>
            <Space className={styles.heroButtons}>
              <Button type="primary" size="large" className={styles.primaryButton}>
                <ShoppingOutlined /> Quản lý đơn hàng
              </Button>
              <Button size="large" className={styles.secondaryButton}>
                <TagsOutlined /> Quản lý sản phẩm
              </Button>
            </Space>
          </div>
          <div className={styles.heroImage}>
            <img 
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80" 
              alt="Hero"
            />
          </div>
        </div>
      </Content>

      {/* Stats Section */}
      <Content className={styles.statsSection}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statCard}>
              <Statistic
                title="Doanh thu hôm nay"
                value={stats.totalSales}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="đ"
                valueStyle={{ color: '#3B82F6' }}
              />
              <div className={styles.statTrend}>
                <ArrowUpOutlined /> 12% so với hôm qua
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statCard}>
              <Statistic
                title="Đơn hàng mới"
                value={stats.totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#10B981' }}
              />
              <div className={styles.statTrend}>
                <ArrowUpOutlined /> 8% so với hôm qua
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statCard}>
              <Statistic
                title="Khách hàng mới"
                value={stats.totalCustomers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#8B5CF6' }}
              />
              <div className={styles.statTrend}>
                <ArrowUpOutlined /> 15% so với hôm qua
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.statCard}>
              <Statistic
                title="Sản phẩm bán chạy"
                value={stats.totalProducts}
                prefix={<TagsOutlined />}
                valueStyle={{ color: '#F59E0B' }}
              />
              <div className={styles.statTrend}>
                <ArrowDownOutlined /> 3% so với hôm qua
              </div>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Features Section */}
      <Content id="features-section" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <Title level={2} className={styles.sectionTitle}>
            Tính năng quản lý
          </Title>
          <Paragraph className={styles.sectionSubtitle}>
            Hệ thống quản lý cửa hàng giày sneaker với đầy đủ tính năng cần thiết
          </Paragraph>
        </div>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card className={styles.featureCard} hoverable>
              <div className={styles.featureIcon}>
                <ShoppingCartOutlined />
              </div>
              <Title level={4}>Quản lý bán hàng</Title>
              <Paragraph className={styles.featureDescription}>
                Xử lý đơn hàng nhanh chóng, in hóa đơn, quản lý thanh toán và theo dõi doanh thu theo thời gian thực.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className={styles.featureCard} hoverable>
              <div className={styles.featureIcon}>
                <TagsOutlined />
              </div>
              <Title level={4}>Quản lý sản phẩm</Title>
              <Paragraph className={styles.featureDescription}>
                Theo dõi tồn kho, quản lý size giày, cập nhật giá và thông tin sản phẩm một cách dễ dàng.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className={styles.featureCard} hoverable>
              <div className={styles.featureIcon}>
                <TeamOutlined />
              </div>
              <Title level={4}>Quản lý khách hàng</Title>
              <Paragraph className={styles.featureDescription}>
                Lưu trữ thông tin khách hàng, lịch sử mua hàng và tạo chương trình khách hàng thân thiết.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Benefits Section */}
      <Content id="benefits-section" className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <Title level={2} className={styles.sectionTitle}>
            Lợi ích khi sử dụng
          </Title>
          <Paragraph className={styles.sectionSubtitle}>
            Giải pháp quản lý cửa hàng giày sneaker chuyên nghiệp
          </Paragraph>
        </div>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12}>
            <div className={styles.benefitsImage}>
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Benefits"
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <HistoryOutlined className={styles.benefitIcon} />
                <div className={styles.benefitContent}>
                  <Title level={4}>Bán hàng nhanh chóng</Title>
                  <Paragraph>
                    Xử lý đơn hàng nhanh chóng, in hóa đơn tự động và quản lý thanh toán hiệu quả.
                  </Paragraph>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <TagsOutlined className={styles.benefitIcon} />
                <div className={styles.benefitContent}>
                  <Title level={4}>Quản lý tồn kho thông minh</Title>
                  <Paragraph>
                    Theo dõi số lượng giày theo size, màu sắc và tự động cảnh báo khi hàng sắp hết.
                  </Paragraph>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <BarChartOutlined className={styles.benefitIcon} />
                <div className={styles.benefitContent}>
                  <Title level={4}>Báo cáo chi tiết</Title>
                  <Paragraph>
                    Theo dõi doanh thu, sản phẩm bán chạy và phân tích xu hướng kinh doanh.
                  </Paragraph>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Content>

      {/* Contact Section */}
      <Content id="contact-section" className={styles.contactSection}>
        <div className={styles.sectionHeader}>
          <Title level={2} className={styles.sectionTitle}>
            Hỗ trợ khách hàng
          </Title>
          <Paragraph className={styles.sectionSubtitle}>
            Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn 24/7
          </Paragraph>
        </div>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12}>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Title level={4}>Liên hệ hỗ trợ</Title>
                <Paragraph>
                  <span role="img" aria-label="phone">📞</span> Hotline: 012 3344 566
                </Paragraph>
                <Paragraph>
                  <span role="img" aria-label="email">📧</span> Email: support@libra.sneaker
                </Paragraph>
              </div>
              <div className={styles.contactItem}>
                <Title level={4}>Giờ làm việc</Title>
                <Paragraph>
                  Thứ 2 - Thứ 6: 8:00 - 22:00
                </Paragraph>
                <Paragraph>
                  Thứ 7 - Chủ nhật: 9:00 - 21:00
                </Paragraph>
              </div>
              <div className={styles.socialLinks}>
                <Space size="large">
                  <Button type="link" href="https://facebook.com" target="_blank" className={styles.socialButton}>
                    <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" />
                  </Button>
                  <Button type="link" href="https://youtube.com" target="_blank" className={styles.socialButton}>
                    <img src="https://img.icons8.com/color/48/000000/youtube-play.png" alt="YouTube" />
                  </Button>
                  <Button type="link" href="https://tiktok.com" target="_blank" className={styles.socialButton}>
                    <img src="https://img.icons8.com/color/48/000000/tiktok.png" alt="TikTok" />
                  </Button>
                  <Button type="link" href="https://instagram.com" target="_blank" className={styles.socialButton}>
                    <img src="https://img.icons8.com/color/48/000000/instagram-new.png" alt="Instagram" />
                  </Button>
                  <Button type="link" href="https://zalo.me" target="_blank" className={styles.socialButton}>
                    <img src="https://img.icons8.com/color/48/000000/zalo.png" alt="Zalo" />
                  </Button>
                </Space>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096365576614!2d105.824964315402!3d21.028511985998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4c4e986b1b%3A0x6e6e8b5b5b5b5b5b!2sPeakview%20Tower!5e0!3m2!1sen!2s!4v1698765432100!5m2!1sen!2s"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: 10 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Col>
        </Row>
      </Content>

      {/* Scroll to Top Button */}
      <div 
        className={`${styles.scrollToTop} ${showScrollTop ? styles.visible : ''}`}
        onClick={scrollToTop}
      >
        <UpOutlined style={{ fontSize: '24px' }} />
      </div>
    </Layout>
  );
};

export default HomePage;
