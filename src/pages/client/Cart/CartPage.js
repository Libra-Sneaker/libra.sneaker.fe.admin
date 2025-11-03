import { Button, Col, DatePicker, Divider, Input, InputNumber, Row, Select, Space, Tag, Typography, Checkbox, Progress, Empty, message } from "antd";
import React, { useEffect, useState } from "react";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import pdStyles from "../Product/ProductDetailPage.module.css";
import BestsellerSlider from "../Common/BestsellerSlider";
import { ShoppingCartOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./CartPage.module.css";
import { CartApi } from "../../../api/client/cart/CartApi";

const { Text, Title } = Typography;
const { TextArea } = Input;

const money = (v) => (v || 0).toLocaleString() + " đ";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const suggestRef = React.useRef(null);

  // Suggestion list (bestsellers) – mimic HomePage
  const bestsellerProducts = [
    {
      id: 5,
      name: "NIKE AIR FORCE 1 '07",
      price: 90.0,
      originalPrice: 110.0,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Nike",
      isBestseller: true,
      discount: 18,
      sold: 1250,
    },
    {
      id: 6,
      name: "ADIDAS STAN SMITH",
      price: 80.0,
      originalPrice: 95.0,
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Adidas",
      isBestseller: true,
      discount: 16,
      sold: 980,
    },
    {
      id: 7,
      name: "VANS OLD SKOOL",
      price: 70.0,
      originalPrice: 85.0,
      image:
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Vans",
      isBestseller: true,
      discount: 18,
      sold: 1150,
    },
  ];

  const loadCart = async () => {
    try {
      const { data } = await CartApi.list();
      // Map backend response to UI model
      const mapped = (data || []).map(it => ({
        id: it.cartDetailId || it.productDetailId,
        productDetailId: it.productDetailId,
        name: it.productName,
        price: it.price,
        qty: it.quantity,
        image: it.image || "",
      }));
      setItems(mapped);
    } catch (_) {
      setItems([]);
    }
  };

  useEffect(() => { loadCart(); }, []);

  // Listen to global events: refresh when product added elsewhere
  useEffect(() => {
    const onRefresh = () => { loadCart(); };
    window.addEventListener('cart:refresh', onRefresh);
    window.addEventListener('cart:add', onRefresh);
    return () => {
      window.removeEventListener('cart:refresh', onRefresh);
      window.removeEventListener('cart:add', onRefresh);
    };
  }, []);

  const onChangeQty = async (id, qty) => {
    const line = items.find(i => i.id === id);
    if (!line) return;
    try {
      await CartApi.update({ productDetailId: line.productDetailId || id, quantity: qty });
      await loadCart();
      window.dispatchEvent(new CustomEvent('cart:refresh'));
    } catch (_) {}
  };
  const onRemove = async (id) => {
    try {
      await CartApi.remove(id);
      await loadCart();
      window.dispatchEvent(new CustomEvent('cart:refresh'));
    } catch (_) {}
  };

  const subtotal = items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0);
  const shipFreeThreshold = 500000;
  const freePercent = Math.min(100, Math.round((subtotal / shipFreeThreshold) * 100));

  const handleAddToCart = (product) => {
    // let header update and persist
    window.dispatchEvent(new CustomEvent('cart:add', { detail: {
      id: product.id,
      name: product.name,
      price: Math.round(product.price || 0) * 1000,
      image: product.image,
      qty: 1,
    }}));

    // fly animation from suggestion image
    const cartEl = document.getElementById('header-cart-anchor');
    if (!cartEl) return;
    const imgEl = document.querySelector(`[data-product-img="cart-suggest-${product.id}"]`);
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

  const scrollSuggest = (dir) => {
    if (!suggestRef.current) return;
    const amount = 300;
    suggestRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.container}>
        <Title level={2} style={{ marginBottom: 12 }}>Giỏ hàng</Title>
        

        {items.length === 0 ? (
          <Empty description="Giỏ hàng trống" />
        ) : (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <div className={styles.itemsCard}>
                <div className={styles.voucherBar}>
                  <Tag color="orange" style={{ margin: 0 }}>EGAFREESHIP</Tag>
                  <Text style={{ flex: 1 }}>Áp dụng mã freeship cho đơn hàng của bạn</Text>
                  <Button size="small">Sao chép</Button>
                </div>

                {items.map((item) => (
                  <div key={item.id} className={styles.itemRow}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.itemImage}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/products/${item.id}`)}
                      />
                    ) : (
                      <div className={styles.itemPlaceholder} />
                    )}
                    <div style={{ flex: 1 }}>
                      <Text
                        strong
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/products/${item.id}`)}
                      >
                        {item.name || `Sản phẩm #${item.id}`}
                      </Text>
                      <div className={styles.itemMeta}>Phân loại: Mặc định</div>
                    </div>
                    <div style={{ minWidth: 120, textAlign: 'right' }}>
                      <Text>{money(item.price)}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Button size="small" onClick={() => onChangeQty(item.id, Math.max(1, (item.qty || 1) - 1))}>-</Button>
                      <InputNumber min={1} value={item.qty || 1} onChange={(v) => onChangeQty(item.id, v || 1)} size="small" />
                      <Button size="small" onClick={() => onChangeQty(item.id, (item.qty || 1) + 1)}>+</Button>
                    </div>
                    <div style={{ minWidth: 130, textAlign: 'right' }}>
                      <Text strong style={{ color: '#ff4d4f' }}>{money((item.price || 0) * (item.qty || 1))}</Text>
                    </div>
                    <Button type="text" danger onClick={() => onRemove(item.id)}>X</Button>
                  </div>
                ))}

                <div style={{ marginTop: 12 }}>
                  <Text strong>Ghi chú đơn hàng</Text>
                  <TextArea rows={3} placeholder="Nhập ghi chú cho đơn hàng..." style={{ marginTop: 8 }} />
                </div>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className={styles.summaryCard}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>HẸN GIỜ NHẬN HÀNG</Text>
                  <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                    <DatePicker style={{ width: '100%' }} placeholder="Ngày nhận hàng" />
                    <Select style={{ width: '100%' }} placeholder="Chọn thời gian">
                      <Select.Option value="morning">Buổi sáng</Select.Option>
                      <Select.Option value="afternoon">Buổi chiều</Select.Option>
                      <Select.Option value="evening">Buổi tối</Select.Option>
                    </Select>
                    <Checkbox>Xuất hóa đơn công ty</Checkbox>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Tạm tính</Text>
                    <Text>{money(subtotal)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Giảm giá</Text>
                    <Text>- 0 đ</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Mã giảm giá</Text>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Input size="small" placeholder="Nhập mã" />
                      <Button size="small">Áp dụng</Button>
                    </div>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text strong>TỔNG CỘNG</Text>
                  <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>{money(subtotal)}</Text>
                </div>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button type="primary" block size="large" onClick={() => message.success('Đi tới thanh toán...')} disabled={!items.length}>Thanh toán ngay</Button>
                  <Button block size="large" onClick={() => window.history.back()}>Tiếp tục mua hàng</Button>
                </Space>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10, opacity: .7 }}>
                  <img alt="visa" src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" style={{ height: 16 }} />
                  <img alt="mc" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" style={{ height: 16 }} />
                </div>
              </div>
            </Col>
          </Row>
        )}

      </div>

      {/* Suggestion within container */}
      <div className={styles.container} style={{ marginTop: 24 }}>
        <BestsellerSlider
          title="Có thể bạn thích"
          products={bestsellerProducts}
          onCardClick={(p) => navigate(`/products/${p.id}`)}
          onAdd={(p) => handleAddToCart(p)}
          dataImgPrefix="cart-suggest"
        />
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;


