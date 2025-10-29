import { Button, Card, Col, Layout, Row, Space, Typography, Input } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  ArrowUpOutlined as UpOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import styles from "./HomePage.module.css";
import Header from "./Header";
import Footer from "./Footer";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const HomePage = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mainSneakerImage, setMainSneakerImage] = useState("https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80");
  const newProductsRef = useRef(null);
  const bestsellerProductsRef = useRef(null);

  // Sample data for products
  const newProducts = [
    {
      id: 1,
      name: "NIKE AIR JORDAN 1 RETRO HIGH",
      price: 120.00,
      originalPrice: 150.00,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Nike",
      isNew: true,
      discount: 20
    },
    {
      id: 2,
      name: "ADIDAS ULTRA BOOST 22",
      price: 180.00,
      originalPrice: 200.00,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Adidas",
      isNew: true,
      discount: 10
    },
    {
      id: 3,
      name: "CONVERSE CHUCK TAYLOR ALL STAR",
      price: 65.00,
      originalPrice: 75.00,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Converse",
      isNew: true,
      discount: 13
    },
    {
      id: 4,
      name: "PUMA RS-X REINVENTION",
      price: 90.00,
      originalPrice: 110.00,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Puma",
      isNew: true,
      discount: 18
    }
  ];

  const bestsellerProducts = [
    {
      id: 5,
      name: "NIKE AIR FORCE 1 '07",
      price: 90.00,
      originalPrice: 110.00,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Nike",
      isBestseller: true,
      discount: 18,
      sold: 1250
    },
    {
      id: 6,
      name: "ADIDAS STAN SMITH",
      price: 80.00,
      originalPrice: 95.00,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Adidas",
      isBestseller: true,
      discount: 16,
      sold: 980
    },
    {
      id: 7,
      name: "VANS OLD SKOOL",
      price: 70.00,
      originalPrice: 85.00,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Vans",
      isBestseller: true,
      discount: 18,
      sold: 1150
    },
    {
      id: 8,
      name: "NEW BALANCE 574",
      price: 85.00,
      originalPrice: 100.00,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "New Balance",
      isBestseller: true,
      discount: 15,
      sold: 890
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowScrollTop(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always start at top when visiting HomePage
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAddToCart = (productId) => {
    const product = [...newProducts, ...bestsellerProducts].find(p => p.id === productId);
    // Inform header to update cart badge/items
    window.dispatchEvent(new CustomEvent('cart:add', { detail: {
      id: productId,
      name: product?.name,
      price: Math.round(product?.price || 0) * 1000,
      image: product?.image,
      qty: 1,
    }}));

    // Fly-to-cart animation
    const cartEl = document.getElementById('header-cart-anchor');
    if (!cartEl) return;
    const imgEl = document.querySelector(`[data-product-img="img-${productId}"]`);
    if (!imgEl) return;
    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();
    const flyImg = imgEl.cloneNode(true);
    flyImg.style.position = 'fixed';
    flyImg.style.left = imgRect.left + 'px';
    flyImg.style.top = imgRect.top + 'px';
    flyImg.style.width = imgRect.width + 'px';
    flyImg.style.height = imgRect.height + 'px';
    flyImg.style.borderRadius = '8px';
    flyImg.style.zIndex = 2000;
    flyImg.style.transition = 'transform 0.8s ease, opacity 0.8s ease, left 0.8s ease, top 0.8s ease, width 0.8s ease, height 0.8s ease';
    document.body.appendChild(flyImg);
    requestAnimationFrame(() => {
      flyImg.style.left = cartRect.left + 'px';
      flyImg.style.top = cartRect.top + 'px';
      flyImg.style.width = '24px';
      flyImg.style.height = '24px';
      flyImg.style.opacity = '0.2';
      flyImg.style.transform = 'translate(0, -20px) scale(0.5)';
    });
    setTimeout(() => { try { document.body.removeChild(flyImg); } catch (_) {} }, 850);
  };

  const scrollProducts = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = 300; // Scroll amount in pixels
      if (direction === 'left') {
        ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleSneakerClick = (imageUrl) => {
    setMainSneakerImage(imageUrl);
  };

  const handleBannerClick = (bannerType) => {
    switch (bannerType) {
      case 'premium':
        // Navigate to premium products page with filter
        navigate('/products?category=premium');
        break;
      case 'limited':
        // Navigate to limited edition products
        navigate('/products?category=limited-edition');
        break;
      case 'classic':
        // Navigate to classic style products
        navigate('/products?category=classic');
        break;
      default:
        // Default to all products
        navigate('/products');
    }
  };

  // Sneaker stack data
  const sneakerStackImages = [
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <Layout className={styles.layout}>
      {/* Header Component */}
      <Header />
      
      {/* Hero Section */}
      <Content id="hero-section" className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Text className={styles.brandText}>LIBRA SNEAKER</Text>
            <Title className={styles.heroTitle}>
              THE ULTIMATE <span className={styles.highlight}>SNEAK</span> SHOE PARADISE
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              Discover the latest collection of premium sneakers from top brands. 
              Quality, style, and comfort combined in every pair.
            </Paragraph>
            <Button type="primary" size="large" className={styles.buyNowButton} onClick={() => navigate('/products')}>
              BUY NOW
            </Button>
            {/* <div className={styles.colorOptions}>
              <Text className={styles.colorLabel}>COLOR:</Text>
              <div className={styles.colorSwatches}>
                <div className={`${styles.colorSwatch} ${styles.orange}`}></div>
                <div className={`${styles.colorSwatch} ${styles.blue}`}></div>
                <div className={`${styles.colorSwatch} ${styles.teal}`}></div>
                <div className={`${styles.colorSwatch} ${styles.gray}`}></div>
              </div>
            </div> */}
          </div>
          <div className={styles.heroImage}>
            <div className={styles.mainSneaker}>
              <img 
                src={mainSneakerImage}
                alt="Main Sneaker"
                className={styles.mainSneakerImg}
              />
            </div>
            <div className={styles.sneakerStack}>
              {sneakerStackImages.map((imageUrl, index) => (
                <div 
                  key={index}
                  className={`${styles.stackItem} ${mainSneakerImage === imageUrl ? styles.active : ''}`}
                  onClick={() => handleSneakerClick(imageUrl)}
                >
                  <img src={imageUrl} alt={`Sneaker ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Content>

      {/* Introduction Banner Section */}
      <Content className={styles.introBannerSection}>
        <div className={styles.introBannerContent}>
          <Title level={2} className={styles.introBannerTitle}>
            KHÁM PHÁ THẾ GIỚI GIÀY SNEAKER
          </Title>
          <Paragraph className={styles.introBannerSubtitle}>
            Từ những thương hiệu hàng đầu thế giới đến những thiết kế độc đáo nhất
          </Paragraph>
          <Row gutter={[24, 24]} className={styles.bannerGrid}>
            <Col xs={24} sm={12} md={8}>
              <div 
                className={styles.bannerCard}
                onClick={() => handleBannerClick('premium')}
              >
                <img 
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Premium Sneakers"
                  className={styles.bannerImage}
                />
                <div className={styles.bannerOverlay}>
                  <Title level={4} className={styles.bannerCardTitle}>PREMIUM COLLECTION</Title>
                  <Text className={styles.bannerCardText}>Những đôi giày cao cấp nhất</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div 
                className={styles.bannerCard}
                onClick={() => handleBannerClick('limited')}
              >
                <img 
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Limited Edition"
                  className={styles.bannerImage}
                />
                <div className={styles.bannerOverlay}>
                  <Title level={4} className={styles.bannerCardTitle}>LIMITED EDITION</Title>
                  <Text className={styles.bannerCardText}>Phiên bản giới hạn độc quyền</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div 
                className={styles.bannerCard}
                onClick={() => handleBannerClick('classic')}
              >
                <img 
                  src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Classic Style"
                  className={styles.bannerImage}
                />
                <div className={styles.bannerOverlay}>
                  <Title level={4} className={styles.bannerCardTitle}>CLASSIC STYLE</Title>
                  <Text className={styles.bannerCardText}>Phong cách cổ điển vượt thời gian</Text>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Content>


      {/* New Products Section */}
      <Content className={styles.newProductsSection}>
        <div className={styles.sectionHeader}>
          <Title level={2} className={styles.sectionTitle}>
            SẢN PHẨM MỚI VỀ
          </Title>
          <Text className={styles.sectionSubtitle}>
            Những mẫu giày mới nhất từ các thương hiệu hàng đầu
          </Text>
        </div>
        
        <div className={styles.horizontalScrollContainer}>
          <Button 
            className={styles.scrollButton}
            icon={<LeftOutlined />}
            onClick={() => scrollProducts('left', newProductsRef)}
          />
          
          <div className={styles.horizontalScrollWrapper} ref={newProductsRef}>
            <div className={styles.horizontalScrollContent}>
              {/* First set of products */}
              {newProducts.map((product) => (
                <div key={product.id} className={styles.horizontalProductCard}>
              <Card className={styles.productCard} hoverable onClick={() => navigate(`/products/${product.id}`)}>
                    <div className={styles.productImageContainer}>
                      <img 
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                        data-product-img={`img-${product.id}`}
                      />
                      <div className={styles.productBadges}>
                        <div className={styles.newBadge}>MỚI</div>
                        <div className={styles.discountBadge}>-{product.discount}%</div>
                      </div>
                  <Button 
                    type="default" 
                    shape="circle" 
                    icon={<ShoppingCartOutlined />} 
                    className={`${styles.addToCartButton} ${styles.addToCartFixed}`}
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                  />
                    </div>
                    <div className={styles.productInfo}>
                      <Text className={styles.productBrand}>{product.brand}</Text>
                      <Text className={styles.productName}>{product.name}</Text>
                      <div className={styles.productPriceContainer}>
                        <Text className={styles.productPrice}>${product.price.toFixed(2)}</Text>
                        <Text className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {newProducts.map((product) => (
                <div key={`duplicate-${product.id}`} className={styles.horizontalProductCard}>
              <Card className={styles.productCard} hoverable onClick={() => navigate(`/products/${product.id}`)}>
                    <div className={styles.productImageContainer}>
                      <img 
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                        data-product-img={`img-${product.id}`}
                      />
                      <div className={styles.productBadges}>
                        <div className={styles.newBadge}>MỚI</div>
                        <div className={styles.discountBadge}>-{product.discount}%</div>
                      </div>
                      <Button 
                        type="default" 
                        shape="circle" 
                        icon={<ShoppingCartOutlined />} 
                        className={`${styles.addToCartButton} ${styles.addToCartFixed}`}
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <Text className={styles.productBrand}>{product.brand}</Text>
                      <Text className={styles.productName}>{product.name}</Text>
                      <div className={styles.productPriceContainer}>
                        <Text className={styles.productPrice}>${product.price.toFixed(2)}</Text>
                        <Text className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            className={styles.scrollButton}
            icon={<RightOutlined />}
            onClick={() => scrollProducts('right', newProductsRef)}
          />
        </div>
        
        {/* <div className={styles.sectionFooter}>
          <Button 
            type="primary" 
            size="large" 
            className={styles.viewAllButton}
            onClick={() => navigate('/products')}
          >
            XEM TẤT CẢ SẢN PHẨM MỚI
          </Button>
        </div> */}
      </Content>

      {/* Bestseller Products Section */}
      <Content className={styles.bestsellerSection}>
        <div className={styles.sectionHeader}>
          <Title level={2} className={styles.sectionTitle}>
            SẢN PHẨM BÁN CHẠY
          </Title>
          <Text className={styles.sectionSubtitle}>
            Những đôi giày được yêu thích nhất hiện tại
          </Text>
        </div>
        
        <div className={styles.horizontalScrollContainer}>
          <Button 
            className={styles.scrollButton}
            icon={<LeftOutlined />}
            onClick={() => scrollProducts('left', bestsellerProductsRef)}
          />
          
          <div className={styles.horizontalScrollWrapper} ref={bestsellerProductsRef}>
            <div className={styles.horizontalScrollContent}>
              {/* First set of products */}
              {bestsellerProducts.map((product) => (
                <div key={product.id} className={styles.horizontalProductCard}>
                  <Card className={styles.productCard} hoverable onClick={() => navigate(`/products/${product.id}`)}>
                    <div className={styles.productImageContainer}>
                      <img 
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                        data-product-img={`img-${product.id}`}
                      />
                      <div className={styles.productBadges}>
                        <div className={styles.bestsellerBadge}>BÁN CHẠY</div>
                        <div className={styles.discountBadge}>-{product.discount}%</div>
                      </div>
                      <Button 
                        type="default" 
                        shape="circle" 
                        icon={<ShoppingCartOutlined />} 
                        className={`${styles.addToCartButton} ${styles.addToCartFixed}`}
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <Text className={styles.productBrand}>{product.brand}</Text>
                      <Text className={styles.productName}>{product.name}</Text>
                      <div className={styles.productPriceContainer}>
                        <Text className={styles.productPrice}>${product.price.toFixed(2)}</Text>
                        <Text className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                      </div>
                      <Text className={styles.soldCount}>Đã bán: {product.sold}</Text>
                    </div>
                  </Card>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {bestsellerProducts.map((product) => (
                <div key={`duplicate-${product.id}`} className={styles.horizontalProductCard}>
                  <Card className={styles.productCard} hoverable onClick={() => navigate(`/products/${product.id}`)}>
                    <div className={styles.productImageContainer}>
                      <img 
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                        data-product-img={`img-${product.id}`}
                      />
                      <div className={styles.productBadges}>
                        <div className={styles.bestsellerBadge}>BÁN CHẠY</div>
                        <div className={styles.discountBadge}>-{product.discount}%</div>
                      </div>
                      <Button 
                        type="default" 
                        shape="circle" 
                        icon={<ShoppingCartOutlined />} 
                        className={`${styles.addToCartButton} ${styles.addToCartFixed}`}
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <Text className={styles.productBrand}>{product.brand}</Text>
                      <Text className={styles.productName}>{product.name}</Text>
                      <div className={styles.productPriceContainer}>
                        <Text className={styles.productPrice}>${product.price.toFixed(2)}</Text>
                        <Text className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                      </div>
                      <Text className={styles.soldCount}>Đã bán: {product.sold}</Text>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            className={styles.scrollButton}
            icon={<RightOutlined />}
            onClick={() => scrollProducts('right', bestsellerProductsRef)}
          />
        </div>
        
        {/* <div className={styles.sectionFooter}>
          <Button 
            type="primary" 
            size="large" 
            className={styles.viewAllButton}
            onClick={() => navigate('/products')}
          >
            XEM TẤT CẢ SẢN PHẨM BÁN CHẠY
          </Button>
        </div> */}
      </Content>

    

      <Footer />


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
