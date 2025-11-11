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
            <Text className={homeStyles.aboutLabel}>VỀ CHÚNG TÔI</Text>
            <Title className={homeStyles.aboutTitle}>
              NÂNG TẦM PHONG CÁCH CỦA BẠN VỚI <span className={homeStyles.highlight}>GIÀY</span>
            </Title>
            <Paragraph className={homeStyles.aboutDescription}>
              Chúng tôi tin rằng những đôi giày tuyệt vời có thể thay đổi không chỉ trang phục của bạn, 
              mà còn cả ngày của bạn. Bộ sưu tập được chọn lọc cẩn thận của chúng tôi có những xu hướng 
              mới nhất và những mẫu cổ điển vượt thời gian, tất cả được thiết kế để giúp bạn bước đi tự tin 
              vào bất cứ điều gì sắp tới.
            </Paragraph>
            <Space className={homeStyles.aboutButtons}>
              <Button type="primary" size="large" className={homeStyles.buyNowButton} onClick={() => navigate('/products')}>
                MUA NGAY
              </Button>
              <Button size="large" className={homeStyles.learnMoreButton} onClick={() => navigate('/about')}>
                TÌM HIỂU THÊM
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


