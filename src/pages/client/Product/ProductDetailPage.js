import { Button, Col, Layout, Row, Typography, Space, Radio, InputNumber, Tag } from "antd";
import { LeftOutlined, RightOutlined, ShoppingCartOutlined, ArrowUpOutlined as UpOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import styles from "./ProductDetailPage.module.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const mockProducts = {
  1: {
    id: 1,
    name: "NIKE AIR SF AIR FORCE 1 MID MEN'S",
    price: 199,
    brand: "Nike",
    category: "Men's Shoes",
    material: "Leather / Mesh",
    colors: [
      { name: "White", code: "#f5f5f5" },
      { name: "Gray", code: "#bfbfbf" },
      { name: "Black", code: "#1f1f1f" },
    ],
    sizes: ["40", "40.5", "41", "42", "43"],
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=600&q=80",
    ],
  },
};

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = mockProducts[id] || mockProducts[1];
  const [mainImage, setMainImage] = React.useState(product.images?.[0]);
  const [selectedColor, setSelectedColor] = React.useState(product.colors?.[0]?.name);
  const [selectedSize, setSelectedSize] = React.useState(product.sizes?.[0]);
  const [quantity, setQuantity] = React.useState(1);
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const bestRef = React.useRef(null);
  const scrollBest = (dir) => {
    if (!bestRef.current) return;
    const amount = 300;
    bestRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleAddToCart = (productId) => {
    const p = mockProducts[id] || mockProducts[1];
    // Dispatch global add-to-cart for header badge/cart
    window.dispatchEvent(new CustomEvent('cart:add', { detail: {
      id: productId,
      name: p?.name,
      price: Math.round(p?.price || 0) * 1000,
      image: p?.images?.[0],
      qty: 1,
    }}));

    // Fly-to-cart animation using current card image
    const cartEl = document.getElementById('header-cart-anchor');
    if (!cartEl) return;
    const imgEl = document.querySelector(`[data-product-img="detail-best-${productId}"]`);
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

  // Always start from top when opening/changing product detail
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  return (
    <Layout className={styles.layout}>
      <Header />
      <Content className={styles.container}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={12}>
            <div className={styles.gallery}>
              <div className={styles.mainImageWrap}>
                <img key={mainImage} src={mainImage} alt={product.name} className={styles.mainImage} />
              </div>
              <div className={styles.thumbRow}>
                {product.images.map((src, idx) => (
                  <div
                    key={idx}
                    className={`${styles.thumbWrap} ${mainImage === src ? styles.active : ''}`}
                    onClick={() => setMainImage(src)}
                  >
                    <img src={src} alt={`thumb-${idx}`} className={styles.thumb} />
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className={styles.info}>
              <Text className={styles.brand}>{product.brand}</Text>
              <Title level={2} className={styles.title}>{product.name}</Title>
              <Title level={2} className={styles.price}>${product.price.toFixed(2)}</Title>

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Danh mục:</span>
                <Tag>{product.category}</Tag>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Chất liệu:</span>
                <Tag color="default">{product.material}</Tag>
              </div>

              <div className={styles.optionGroup}>
                <div className={styles.optionLabel}>Màu sắc</div>
                <div className={styles.colorRow}>
                  {product.colors?.map((c) => (
                    <button
                      key={c.name}
                      className={`${styles.colorDot} ${selectedColor === c.name ? styles.active : ''}`}
                      style={{ backgroundColor: c.code }}
                      onClick={() => setSelectedColor(c.name)}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.optionGroup}>
                <div className={styles.optionLabel}>Size</div>
                <Radio.Group value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                  <Space wrap>
                    {product.sizes?.map((s) => (
                      <Radio.Button key={s} value={s}>{s}</Radio.Button>
                    ))}
                  </Space>
                </Radio.Group>
              </div>

              <div className={styles.optionGroup}>
                <div className={styles.optionLabel}>Số lượng</div>
                <InputNumber min={1} max={product.stock || 99} value={quantity} onChange={(v) => setQuantity(v || 1)} />
                <span className={styles.stockNote}>Còn {product.stock} sản phẩm</span>
              </div>
              <Space size="middle">
                <Button type="primary" size="large">Add to cart</Button>
                <Button size="large" onClick={() => console.log('Mua Ngay')}>Mua Ngay</Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Content>
      {/* Details and Bestsellers */}
      <Content className={styles.extraContainer}>
        {/* Chi tiết sản phẩm */}
        <div className={styles.detailsSection}>
          <Title level={3} className={styles.sectionTitle}>CHI TIẾT SẢN PHẨM</Title>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}><span>Danh mục:</span><strong>{product.category}</strong></div>
            <div className={styles.detailItem}><span>Chất liệu:</span><strong>{product.material}</strong></div>
            <div className={styles.detailItem}><span>Màu sắc:</span><strong>{selectedColor}</strong></div>
            <div className={styles.detailItem}><span>Size:</span><strong>{selectedSize}</strong></div>
            <div className={styles.detailItem}><span>Tồn kho:</span><strong>{product.stock}</strong></div>
          </div>
        </div>

        {/* Sản phẩm bán chạy */}
        <div className={styles.bestsellerSection}>
          <Title level={3} className={styles.sectionTitle}>SẢN PHẨM BÁN CHẠY</Title>
          <div className={styles.hsContainer}>
            <Button className={styles.hsNavBtn} icon={<LeftOutlined />} onClick={() => scrollBest('left')} />
            <div className={styles.hsWrapper} ref={bestRef}>
              <div className={styles.hsContent}>
                {[1,2,3,4,5,6].map((idx) => {
                  const idToGo = String(idx);
                  const p = mockProducts[1];
                  return (
                    <div key={idx} className={styles.horizontalProductCard}>
                      <div className={styles.productCard} onClick={() => navigate(`/products/${idToGo}`)}>
                        <div className={styles.productImageContainer} onClick={() => navigate(`/products/${idToGo}`)}>
                          <img src={p.images[0]} alt={p.name} className={styles.productImage} data-product-img={`detail-best-${idToGo}`} />
                          <div className={styles.productBadges}>
                            <div className={styles.bestsellerBadge}>BÁN CHẠY</div>
                          </div>
                          <Button type="default" shape="circle" icon={<ShoppingCartOutlined />} className={`${styles.addToCartButton} ${styles.addToCartFixed}`} onClick={(e)=>{ e.stopPropagation(); handleAddToCart(idToGo); }} />
                        </div>
                        <div className={styles.productInfo} onClick={() => navigate(`/products/${idToGo}`)}>
                          <Text className={styles.productBrand}>Nike</Text>
                          <Text className={styles.productName}>{p.name}</Text>
                          <div className={styles.productPriceContainer}>
                            <Text className={styles.productPrice}>${p.price.toFixed(2)}</Text>
                            <Text className={styles.originalPrice}>$220.00</Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {[1,2,3,4,5,6].map((idx) => {
                  const idToGo = String(idx);
                  const p = mockProducts[1];
                  return (
                    <div key={`dup-${idx}`} className={styles.horizontalProductCard}>
                      <div className={styles.productCard} onClick={() => navigate(`/products/${idToGo}`)}>
                        <div className={styles.productImageContainer} onClick={() => navigate(`/products/${idToGo}`)}>
                          <img src={p.images[0]} alt={p.name} className={styles.productImage} data-product-img={`detail-best-${idToGo}`} />
                          <div className={styles.productBadges}>
                            <div className={styles.bestsellerBadge}>BÁN CHẠY</div>
                          </div>
                          <Button type="default" shape="circle" icon={<ShoppingCartOutlined />} className={`${styles.addToCartButton} ${styles.addToCartFixed}`} onClick={(e)=>{ e.stopPropagation(); handleAddToCart(idToGo); }} />
                        </div>
                        <div className={styles.productInfo} onClick={() => navigate(`/products/${idToGo}`)}>
                          <Text className={styles.productBrand}>Nike</Text>
                          <Text className={styles.productName}>{p.name}</Text>
                          <div className={styles.productPriceContainer}>
                            <Text className={styles.productPrice}>${p.price.toFixed(2)}</Text>
                            <Text className={styles.originalPrice}>$220.00</Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Button className={styles.hsNavBtn} icon={<RightOutlined />} onClick={() => scrollBest('right')} />
          </div>
        </div>
      </Content>
      <Footer />

      {/* Scroll to Top */}
      <div className={`${styles.scrollToTop} ${showScrollTop ? styles.visible : ''}`} onClick={scrollToTop}>
        <UpOutlined style={{ fontSize: '24px' }} />
      </div>
    </Layout>
  );
};

export default ProductDetailPage;


