import { Button, Card, Col, Layout, Row, Typography, Input, Space, Collapse, Radio, Checkbox, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  ArrowUpOutlined as UpOutlined,
  FilterOutlined,
  UpOutlined as UpIcon,
  DownOutlined as DownIcon,
} from "@ant-design/icons";
import styles from "./ProductPage.module.css";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import { HomeApi } from "../../../api/client/home/HomeApi";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const ProductPage = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const getColorHex = (vnName) => {
    const name = String(vnName || '').trim().toLowerCase();
    const map = {
      'đen': '#000000',
      'trắng': '#FFFFFF',
      'xám': '#808080',
      'xám đậm': '#505050',
      'xám nhạt': '#BFBFBF',
      'ghi': '#9E9E9E',
      'than': '#36454F',
      'vàng': '#FFFF00',
      'vàng chanh': '#DFFF00',
      'vàng đồng': '#B8860B',
      'cam': '#FFA500',
      'cam đất': '#E77E23',
      'cam nhạt': '#FFC187',
      'nâu': '#A52A2A',
      'nâu đậm': '#5C4033',
      'nâu nhạt': '#C4A484',
      'nâu đỏ': '#8B0000',
      'nâu sữa': '#A68064',
      'hồng': '#FFC0CB',
      'hồng nhạt': '#FFD1DC',
      'hồng đậm': '#FF69B4',
      'tím': '#800080',
      'tím than': '#301934',
      'tím nhạt': '#C3B1E1',
      'đỏ': '#FF0000',
      'đỏ tươi': '#FF2400',
      'đỏ đậm': '#8B0000',
      'đỏ đô': '#800000',
      'xanh lá': '#008000',
      'xanh lục': '#228B22',
      'xanh rêu': '#4F7942',
      'xanh mint': '#98FF98',
      'xanh dương': '#0000FF',
      'xanh lam': '#1E90FF',
      'xanh': '#00AEEF',
      'xanh navy': '#001F3F',
      'xanh coban': '#0047AB',
      'xanh đen': '#003153',
      'be': '#F5F5DC',
      'be đậm': '#E5D1A7',
      'be nhạt': '#FFF5D7',
      'kem': '#FFFDD0',
      'trắng sữa': '#FFFAF0',
      'trắng ngà': '#FAF0E6',
      'bạc': '#C0C0C0',
      'vàng kim': '#FFD700',
      'trong suốt': 'transparent',
      // English fallbacks
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#808080',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'brown': '#A52A2A',
      'pink': '#FFC0CB',
      'purple': '#800080',
      'navy': '#001F3F',
      'transparent': 'transparent',
    };
    return map[name] || '#f0f0f0';
  };
  const [brandOptions, setBrandOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState();
  const [selectedMaterialId, setSelectedMaterialId] = useState();
  const [selectedTypeId, setSelectedTypeId] = useState();
  const [selectedStatuses, setSelectedStatuses] = useState([]); // [1,0]
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

  // Filter data
  const categories = [
    { name: 'Lifestyle', count: 367 },
    { name: 'Running', count: 76 },
    { name: 'Basketball', count: 65 },
    { name: 'Football', count: 21 },
    { name: 'Soccer', count: 12 },
    { name: 'Training & Gym', count: 54 }
  ];

  const priceRanges = [
    { label: 'Under 50', value: 'under-50' },
    { label: '50 to 100', value: '50-100' },
    { label: '100 to 150', value: '100-150' },
    { label: '150 to 200', value: '150-200' },
    { label: '250 to 300', value: '250-300' },
    { label: 'Over 300', value: 'over-300' }
  ];

  const colors = [
    { name: 'White', color: '#FFFFFF' },
    { name: 'Gray', color: '#808080' },
    { name: 'Black', color: '#000000' },
    { name: 'Yellow', color: '#FFFF00' },
    { name: 'Orange', color: '#FFA500' },
    { name: 'Green', color: '#008000' },
    { name: 'Brown', color: '#A52A2A' },
    { name: 'Beige', color: '#F5F5DC' },
    { name: 'Pink', color: '#FFC0CB' },
    { name: 'Red', color: '#FF0000' },
    { name: 'Purple', color: '#800080' },
    { name: 'Blue', color: '#0000FF' }
  ];

  const sizes = [
    '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5',
    '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5',
    '14', '14.5', '15', '15.5', '16', '3.5Y', '4Y', '6Y', '6.5Y', '7Y'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowScrollTop(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always start at top when visiting ProductPage
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const resetFilters = () => {
    setSelectedBrandId(undefined);
    setSelectedMaterialId(undefined);
    setSelectedTypeId(undefined);
    setSelectedColors([]);
    setSelectedSizes([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPriceRange('');
    setPage(1);
  };

  // Fetch filter options (single endpoint)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await HomeApi.getProductFilters();
        setBrandOptions((data?.brands || []).map((b) => ({ label: b.name, value: b.id })));
        setMaterialOptions((data?.materials || []).map((m) => ({ label: m.name, value: m.id })));
        setTypeOptions((data?.types || []).map((t) => ({ label: t.name, value: t.id })));
        setSizeOptions((data?.sizes || []).map((s) => ({ label: s, value: s })));
        setColorOptions((data?.colors || []).map((c) => ({ label: c, value: c })));
      } catch (e) {
        // silent fail keeps local fallbacks
      }
    })();
  }, []);

  // Fetch new arrivals (last 30 days)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await HomeApi.getNewArrivals({ page: 0, size: 8 });
        const mapped = (data?.content || []).map((item) => ({
          id: item.productId,
          name: item.productName || item.productCode || `Product ${item.productId}`,
          price: (() => {
            if (!item.price) return 0;
            const first = String(item.price).split(',')[0]?.trim();
            const num = Number(first);
            return isNaN(num) ? 0 : num;
          })(),
          image: item.urlImg || "https://via.placeholder.com/300",
          brand: item.brand || "",
          sold: item.totalSoldQuantity || 0,
        }));
        setNewArrivals(mapped);
      } catch (_) {}
    })();
  }, []);

  // Fetch best sellers (>5 sold)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await HomeApi.getBestSellers({ minSold: 5 });
        const mapped = (data || []).map((item) => ({
          id: item.productId,
          name: item.productName,
          image: item.urlImg || "https://via.placeholder.com/300",
          sold: item.totalSoldQuantity || 0,
          price: (() => {
            if (!item.price) return 0;
            const num = Number(String(item.price).split(',')[0]?.trim());
            return isNaN(num) ? 0 : num;
          })(),
        }));
        setBestSellers(mapped);
      } catch (_) {}
    })();
  }, []);

  // Fetch products from API (paginated + filter by name)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: page - 1,
          size: pageSize,
          name: searchQuery || undefined,
          brandId: selectedBrandId || undefined,
          materialId: selectedMaterialId || undefined,
          typeId: selectedTypeId || undefined,
          colors: selectedColors.length ? selectedColors : undefined,
          sizes: selectedSizes.length ? selectedSizes : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          status: selectedStatuses.length ? selectedStatuses : undefined,
        };
        const { data } = await HomeApi.getProductOverview(params);
        const mapped = (data?.content || []).map((item) => ({
          id: item.productId,
          name: item.productName || item.productCode || `Product ${item.productId}`,
          // price field is grouped string; show first or join
          price: (() => {
            if (!item.price) return 0;
            const first = String(item.price).split(',')[0]?.trim();
            const num = Number(first);
            return isNaN(num) ? 0 : num;
          })(),
          image: item.urlImg || "https://via.placeholder.com/300",
          brand: item.brand || "",
          sold: item.totalSoldQuantity || 0,
          colors: item.colors || "",
          sizes: item.sizes || "",
          colorsArr: (item.colors ? String(item.colors).split(',').map((c)=>c.trim()) : []),
          sizesArr: (item.sizes ? String(item.sizes).split(',').map((s)=>s.trim()) : []),
        }));
        setProducts(mapped);
        setTotalItems(data?.totalElements || 0);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setProducts([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize, searchQuery, selectedBrandId, selectedMaterialId, selectedTypeId, selectedColors, selectedSizes, minPrice, maxPrice]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAddToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    // Try add to backend by picking first product_detail of this product
    (async () => {
      try {
        const { ProductDetailManagementApi } = await import("../../../api/admin/productDetailManagement/productDetailManagementApi");
        const { data } = await ProductDetailManagementApi.getProductDetails({ id: productId, page: 0, size: 1 });
        const line = data?.content?.[0];
        if (line?.productDetailId || line?.id) {
          const { CartApi } = await import("../../../api/client/cart/CartApi");
          await CartApi.add({ productDetailId: line.productDetailId || line.id, quantity: 1 });
          window.dispatchEvent(new CustomEvent('cart:refresh'));
        } else {
          // Fallback to local header add if no detail
          window.dispatchEvent(new CustomEvent('cart:add', { detail: {
            id: productId,
            name: product?.name,
            price: Math.round(product?.price || 0),
            image: product?.image,
            qty: 1,
          }}));
        }
      } catch (_) {
        window.dispatchEvent(new CustomEvent('cart:add', { detail: {
          id: productId,
          name: product?.name,
          price: Math.round(product?.price || 0),
          image: product?.image,
          qty: 1,
        }}));
      }
    })();

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

  // Filter products by name
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <Layout className={styles.layout}>
      {/* Header Component */}
      <Header />

      {/* Page Header */}
      {/* <Content className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <Title level={1} className={styles.pageTitle}>Men's Shoes</Title>
        </div>
          {newArrivals.length > 0 && (
            <div style={{ margin: '16px 0' }}>
              <Title level={4}>SẢN PHẨM MỚI VỀ</Title>
              <Row gutter={[16, 16]}>
                {newArrivals.map((p) => (
                  <Col xs={12} sm={12} md={8} lg={6} key={`new-${p.id}`}>
                    <Card className={styles.productCard} onClick={() => navigate(`/products/${p.id}`)} hoverable>
                      <div className={styles.productImageContainer}>
                        <img src={p.image} alt={p.name} className={styles.productImage} />
                      </div>
                      <div className={styles.productInfo}>
                        <Text className={styles.productName}>{p.name}</Text>
                        <div className={styles.priceRow}>
                          <Text className={styles.productPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</Text>
                          <Text className={styles.soldCount}>Đã bán: {p.sold || 0}</Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {bestSellers.length > 0 && (
            <div style={{ margin: '24px 0' }}>
              <Title level={4}>SẢN PHẨM BÁN CHẠY</Title>
              <Row gutter={[16, 16]}>
                {bestSellers.map((p) => (
                  <Col xs={12} sm={12} md={8} lg={6} key={`best-${p.id}`}>
                    <Card className={styles.productCard} onClick={() => navigate(`/products/${p.id}`)} hoverable>
                      <div className={styles.productImageContainer}>
                        <img src={p.image} alt={p.name} className={styles.productImage} />
                      </div>
                      <div className={styles.productInfo}>
                        <Text className={styles.productName}>{p.name}</Text>
                        <div className={styles.priceRow}>
                          <Text className={styles.productPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</Text>
                          <Text className={styles.soldCount}>Đã bán: {p.sold || 0}</Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
      </Content> */}

      {/* Main Content */}
      <div style={{ paddingLeft: '32px' }}>
      <Content className={styles.mainContent}>
        <Row gutter={[24, 24]} className={styles.contentRow}>
          {/* Sidebar */}
          <Col xs={24} lg={5} className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <Title level={4} className={styles.sidebarTitle}>Libra Sneakers</Title>

              {/* Sort Options */}
              {/* <div className={styles.sortSection}>
                <Space size="small" className={styles.sortButtons}>
                  <Button
                    type={sortBy === 'newest' ? 'primary' : 'default'}
                    onClick={() => setSortBy('newest')}
                    className={styles.sortButton}
                  >
                    Newest
                  </Button>
                  <Button
                    type={sortBy === 'highest-rated' ? 'primary' : 'default'}
                    onClick={() => setSortBy('highest-rated')}
                    className={styles.sortButton}
                  >
                    Highest Rated
                  </Button>
                  <Button
                    type={sortBy === 'low-price' ? 'primary' : 'default'}
                    onClick={() => setSortBy('low-price')}
                    className={styles.sortButton}
                  >
                    Low Price to High
                  </Button>
                  <Button
                    type={sortBy === 'high-price' ? 'primary' : 'default'}
                    onClick={() => setSortBy('high-price')}
                    className={styles.sortButton}
                  >
                    High Price to Low
                  </Button>
                </Space>
              </div> */}

              {/* Thương hiệu / Chất liệu / Loại */}
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Thương hiệu</Title>
                </div>
                <div className={styles.sizeGrid}>
                  {(brandOptions || []).map((b) => (
                    <Button
                      key={b.value}
                      type={selectedBrandId === b.value ? 'primary' : 'default'}
                      className={styles.sizeButton}
                      onClick={() => { setSelectedBrandId(selectedBrandId === b.value ? undefined : b.value); setPage(1); }}
                    >
                      {b.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Chất liệu</Title>
                </div>
                <div className={styles.sizeGrid}>
                  {(materialOptions || []).map((m) => (
                    <Button
                      key={m.value}
                      type={selectedMaterialId === m.value ? 'primary' : 'default'}
                      className={styles.sizeButton}
                      onClick={() => { setSelectedMaterialId(selectedMaterialId === m.value ? undefined : m.value); setPage(1); }}
                    >
                      {m.label}
                    </Button>
                  ))}
                </div>
                    </div>
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Loại</Title>
                </div>
                <div className={styles.sizeGrid}>
                  {(typeOptions || []).map((t) => (
                    <Button
                      key={t.value}
                      type={selectedTypeId === t.value ? 'primary' : 'default'}
                      className={styles.sizeButton}
                      onClick={() => { setSelectedTypeId(selectedTypeId === t.value ? undefined : t.value); setPage(1); }}
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Giá */}
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Giá</Title>
                </div>
                <div className={styles.filterContent}>
                  <Space wrap>
                    {[
                      { label: 'Dưới 500K', min: 0, max: 500000 },
                      { label: '500K - 1M', min: 500000, max: 1000000 },
                      { label: '1M - 2M', min: 1000000, max: 2000000 },
                      { label: 'Trên 2M', min: 2000000, max: undefined },
                    ].map((opt) => (
                      <Button
                        key={opt.label}
                        type={(minPrice === opt.min && maxPrice === opt.max) ? 'primary' : 'default'}
                        onClick={() => {
                          setMinPrice(opt.min);
                          setMaxPrice(opt.max);
                          setPriceRange(opt.label);
                          setPage(1);
                        }}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </Space>
                </div>
              </div>

              {/* Màu sắc */}
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Màu sắc</Title>
                  <UpIcon className={styles.filterIcon} />
                </div>
                <div className={styles.filterContent}>
                  <div className={styles.colorGrid}>
                    {(colorOptions.length ? colorOptions : colors).map((color) => (
                      <div
                        key={color.label || color.name}
                        className={`${styles.colorSwatch} ${selectedColors.includes(color.label || color.name) ? styles.selected : ''}`}
                        style={{ backgroundColor: color.color || getColorHex(color.label || color.name) }}
                        onClick={() => {
                          const val = color.label || color.name;
                          if (selectedColors.includes(val)) {
                            setSelectedColors(selectedColors.filter(c => c !== val)); setPage(1);
                          } else {
                            setSelectedColors([...selectedColors, val]); setPage(1);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Kích cỡ */}
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Kích cỡ</Title>
                  <UpIcon className={styles.filterIcon} />
                </div>
                <div className={styles.filterContent}>
                  <div className={styles.sizeGrid}>
                    {(sizeOptions.length ? sizeOptions.map(s=>s.value) : sizes).map((size) => (
                      <Button
                        key={size}
                        type={selectedSizes.includes(size) ? 'primary' : 'default'}
                        className={styles.sizeButton}
                        onClick={() => {
                          if (selectedSizes.includes(size)) {
                            setSelectedSizes(selectedSizes.filter(s => s !== size)); setPage(1);
                          } else {
                            setSelectedSizes([...selectedSizes, size]); setPage(1);
                          }
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              

              <div className={styles.filterSection}>
                {/* <Button type="primary" block onClick={() => { setPage(1); }}>
                  Apply Filters
                </Button> */}
                <Button style={{ marginTop: 8 }} block onClick={resetFilters}>
                  Reset bộ lọc
                </Button>
              </div>
            </div>
          </Col>


          {/* Products Grid */}
          <Col xs={24} lg={19} className={styles.productsColumn}>
            <div className={styles.searchBar}>
              <Search
                placeholder="Tìm kiếm theo tên sản phẩm"
                allowClear
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={(value) => setSearchQuery(value)}
                enterButton
                size="large"
              />
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text>Không tìm thấy sản phẩm nào</Text>
              </div>
            ) : (
            <Row gutter={[16, 16]} className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <Col xs={12} sm={12} md={8} lg={6} key={product.id}>
                  <Card className={styles.productCard} onClick={() => navigate(`/products/${product.id}`)} hoverable>
                    <div className={styles.productImageContainer}>
                      <img 
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                        data-product-img={`img-${product.id}`}
                      />
                      <Button
                        type="default"
                        shape="circle"
                        icon={<ShoppingCartOutlined />}
                        className={`${styles.addToCartButton} ${styles.addToCartFixed}`}
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <Text className={styles.productName}>{product.name}</Text>
                      {/* <Text className={styles.productDescription}>Men's Shoe</Text> */}
                      <div className={styles.priceRow}>
                        <Text className={styles.productPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</Text>
                        <Text className={styles.soldCount}>Đã bán: {product.sold || 0}</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            )}
          </Col>
        </Row>
      </Content>
      </div>
      

      {/* Scroll to Top Button */}
      <Footer className={styles.footer} />

      <div
        className={`${styles.scrollToTop} ${showScrollTop ? styles.visible : ''}`}
        onClick={scrollToTop}
      >
        <UpOutlined style={{ fontSize: '24px' }} />
      </div>
    </Layout>
  );
};

export default ProductPage;

