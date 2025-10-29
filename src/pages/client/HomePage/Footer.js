import React from "react";
import { Button, Col, Layout, Row, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import homeStyles from "./HomePage.module.css";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Content id="about-section" className={homeStyles.aboutSection}>
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} md={12}>
          <div className={homeStyles.aboutContent}>
            <Text className={homeStyles.aboutLabel}>ABOUT US</Text>
            <Title className={homeStyles.aboutTitle}>
              ELEVATE YOUR LOOK WITH <span className={homeStyles.highlight}>SHOES</span>
            </Title>
            <Paragraph className={homeStyles.aboutDescription}>
              We believe that great shoes can transform not just your outfit, but your entire day. 
              Our carefully curated collection features the latest trends and timeless classics, 
              all designed to help you step confidently into whatever comes next.
            </Paragraph>
            <Space className={homeStyles.aboutButtons}>
              <Button type="primary" size="large" className={homeStyles.buyNowButton} onClick={() => navigate('/products')}>
                BUY NOW
              </Button>
              <Button size="large" className={homeStyles.learnMoreButton}>
                LEARN MORE
              </Button>
            </Space>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className={homeStyles.aboutImage}>
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="About Us Sneaker"
              className={homeStyles.aboutSneakerImg}
            />
            <div className={homeStyles.glowEffect}></div>
          </div>
        </Col>
      </Row>
    </Content>
  );
};

export default Footer;


