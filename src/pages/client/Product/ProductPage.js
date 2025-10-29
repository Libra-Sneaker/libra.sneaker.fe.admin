import { Button, Card, Col, Layout, Row, Typography, Input, Space, Collapse, Radio, Checkbox } from "antd";
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

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const ProductPage = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('100-150');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "NIKE AIR SF AIR FORCE 1 MID MEN'S",
      price: 30.00,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Nike"
    },
    {
      id: 2,
      name: "BLACK RUNNING SHOE",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Adidas"
    },
    {
      id: 3,
      name: "BLUE WHITE HIGH TOP",
      price: 55.00,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Converse"
    },
    {
      id: 4,
      name: "RED WHITE HIGH TOP",
      price: 65.00,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Nike"
    },
    {
      id: 5,
      name: "PUMA CLASSIC SNEAKER",
      price: 40.00,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Puma"
    },
    {
      id: 6,
      name: "CAT WORKING BOOT",
      price: 80.00,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Cat"
    },
    {
      id: 7,
      name: "NIKE AIR SF AIR FORCE 1 MID MEN'S",
      price: 30.00,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Nike"
    },
    {
      id: 8,
      name: "BLACK RUNNING SHOE",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Adidas"
    },
    {
      id: 9,
      name: "BLUE WHITE HIGH TOP",
      price: 55.00,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Converse"
    },
    {
      id: 10,
      name: "RED WHITE HIGH TOP",
      price: 65.00,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Nike"
    },
    {
      id: 11,
      name: "PUMA CLASSIC SNEAKER",
      price: 40.00,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Puma"
    },
    {
      id: 12,
      name: "CAT WORKING BOOT",
      price: 80.00,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Cat"
    },
    {
      id: 13,
      name: "BLUE WHITE HIGH TOP",
      price: 55.00,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Converse"
    },
    {
      id: 14,
      name: "RED WHITE HIGH TOP",
      price: 65.00,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Nike"
    },
    {
      id: 15,
      name: "PUMA CLASSIC SNEAKER",
      price: 40.00,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Puma"
    },
    {
      id: 16,
      name: "CAT WORKING BOOT",
      price: 80.00,
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      brand: "Cat"
    }
  ]);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAddToCart = (productId) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId);
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
      </Content> */}

      {/* Main Content */}
      <div style={{ paddingLeft: '32px' }}>
      <Content className={styles.mainContent}>
        <Row gutter={[24, 24]} className={styles.contentRow}>
          {/* Sidebar */}
          <Col xs={24} lg={5} className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <Title level={4} className={styles.sidebarTitle}>Men's Shoes & Sneakers</Title>

              {/* Sort Options */}
              <div className={styles.sortSection}>
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
              </div>

              {/* Categories */}
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Categories</Title>
                  <UpIcon className={styles.filterIcon} />
                </div>
                <div className={styles.filterContent}>
                  {categories.map((category) => (
                    <div key={category.name} className={styles.categoryItem}>
                      <Checkbox
                        checked={selectedCategories.includes(category.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category.name]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                          }
                        }}
                      />
                      <span className={styles.categoryName}>{category.name}</span>
                      <span className={styles.categoryCount}>({category.count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Price</Title>
                  <UpIcon className={styles.filterIcon} />
                </div>
                <div className={styles.filterContent}>
                  <Radio.Group
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className={styles.priceGroup}
                  >
                    {priceRanges.map((range) => (
                      <Radio key={range.value} value={range.value} className={styles.priceRadio}>
                        {range.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              </div>

              {/* Colors */}
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Colors</Title>
                  <UpIcon className={styles.filterIcon} />
                </div>
                <div className={styles.filterContent}>
                  <div className={styles.colorGrid}>
                    {colors.map((color) => (
                      <div
                        key={color.name}
                        className={`${styles.colorSwatch} ${selectedColors.includes(color.name) ? styles.selected : ''}`}
                        style={{ backgroundColor: color.color }}
                        onClick={() => {
                          if (selectedColors.includes(color.name)) {
                            setSelectedColors(selectedColors.filter(c => c !== color.name));
                          } else {
                            setSelectedColors([...selectedColors, color.name]);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                  <Title level={5} className={styles.filterTitle}>Size</Title>
                  <UpIcon className={styles.filterIcon} />
                </div>
                <div className={styles.filterContent}>
                  <div className={styles.sizeGrid}>
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        type={selectedSizes.includes(size) ? 'primary' : 'default'}
                        className={styles.sizeButton}
                        onClick={() => {
                          if (selectedSizes.includes(size)) {
                            setSelectedSizes(selectedSizes.filter(s => s !== size));
                          } else {
                            setSelectedSizes([...selectedSizes, size]);
                          }
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
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
            <Row gutter={[16, 16]} className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <Col xs={12} sm={12} md={8} lg={6} key={product.id}>
                  <Card className={styles.productCard} onClick={() => navigate(`/products/${product.id}`)} hoverable>
                    <div className={styles.productImageContainer}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
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
                        <Text className={styles.productPrice}>${product.price.toFixed(0)}</Text>
                        <Text className={styles.soldCount}>Đã bán: {product.sold || 0}</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
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

