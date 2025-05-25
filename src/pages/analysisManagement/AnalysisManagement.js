import React, { useEffect, useState } from "react";
import styles from "./AnalysisManagement.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { ProductManagementApi } from "../../api/admin/productManagement/ProductManagementApi";
import { Bar, Pie } from "react-chartjs-2";
import { DatePicker, Typography, Empty, Spin } from "antd";
import { CustomerManagementApi } from "../../api/admin/customerManagement/CustomerManagementApi";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;
const { Text } = Typography;

const AnalysisManagement = () => {
  const [loading, setLoading] = useState(true);
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    soldProducts: 0,
    remainingProducts: 0,
  });

  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    revenueByDate: [],
    revenueByCategory: [],
  });
  const [dateRange, setDateRange] = useState([]);

  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  const [customerStats, setCustomerStats] = useState({
    totalCustomersThisMonth: 0,
    topCustomers: [],
  });

  // Bộ màu mới, chuyên nghiệp
  const colors = {
    primary: "#4F46E5", // Indigo
    success: "#10B981", // Emerald
    danger: "#F43F5E", // Rose
    purple: "#7C3AED", // Violet
    gray: "#667085", // Slate
    dark: "#344054", // Slate
  };

  // Gọi API để lấy dữ liệu thống kê sản phẩm
  // Cập nhật useEffect để sử dụng dateRange
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Nếu có dateRange, sử dụng nó để lấy dữ liệu
        const params =
          dateRange.length === 2
            ? {
                startDate: dateRange[0].format("YYYY-MM-DD"),
                endDate: dateRange[1].format("YYYY-MM-DD"),
              }
            : {};

        // Gọi API lấy thống kê sản phẩm
        const statsResponse = await ProductManagementApi.getProductStatistics(
          params
        );
        const statsData = statsResponse.data;

        const sold = statsData.soldProducts || 0;
        const remaining = statsData.remainingProducts || 0;
        const calculatedTotal = sold + remaining;

        setProductStats({
          totalProducts: calculatedTotal,
          soldProducts: sold,
          remainingProducts: remaining,
        });

        // Gọi API lấy sản phẩm bán chạy
        const bestSaleResponse = await ProductManagementApi.getBestSaleProduct(
          params
        );
        setBestSellingProducts(bestSaleResponse.data);

        // Gọi API lấy thống kê khách hàng
        const customerResponse = await CustomerManagementApi.getLoyalCustomer(
          params
        );
        const customerData = customerResponse.data;
        setCustomerStats({
          totalCustomersThisMonth: customerData.totalCustomersThisMonth || 0,
          topCustomers: customerData.topCustomers || [],
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // Dữ liệu cho biểu đồ cột
  const productStatsBarData = {
    labels: ["Tổng số sản phẩm", "Số sản phẩm đã bán", "Số sản phẩm tồn kho"],
    datasets: [
      {
        label: "Số lượng",
        data: [
          productStats.totalProducts,
          productStats.soldProducts,
          productStats.remainingProducts,
        ],
        backgroundColor: [
          `${colors.primary}99`, // Indigo with opacity
          `${colors.success}99`, // Green with opacity
          `${colors.danger}99`, // Red with opacity
        ],
        borderColor: [colors.primary, colors.success, colors.danger],
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn
  const productStatsPieData = {
    labels: ["Số sản phẩm đã bán", "Số sản phẩm tồn kho"],
    datasets: [
      {
        data: [productStats.soldProducts, productStats.remainingProducts],
        backgroundColor: [
          `${colors.success}99`, // Green with opacity
          `${colors.danger}99`, // Red with opacity
        ],
        borderColor: [colors.success, colors.danger],
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ sản phẩm bán chạy
  const bestSellingProductsData = {
    labels: bestSellingProducts.map((product) => product.name),
    datasets: [
      {
        label: "Số lượng đã bán",
        data: bestSellingProducts.map((product) => product.quantitySold),
        backgroundColor: `${colors.primary}99`,
        borderColor: colors.primary,
        borderWidth: 1,
      },
    ],
  };

  // Xử lý thay đổi ngày
  const handleDateChange = async (dates) => {
    if (!dates || dates.length === 0) {
      setDateRange([]);
      return;
    }

    setDateRange(dates);
    setLoading(true);

    try {
      // Format dates để gửi lên server
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");

      // Gọi API lấy thống kê sản phẩm theo khoảng thời gian
      const statsResponse = await ProductManagementApi.getProductStatistics({
        startDate,
        endDate,
      });
      const statsData = statsResponse.data;

      // Cập nhật state với dữ liệu mới
      const sold = statsData.soldProducts || 0;
      const remaining = statsData.remainingProducts || 0;
      const calculatedTotal = sold + remaining;

      setProductStats({
        totalProducts: calculatedTotal,
        soldProducts: sold,
        remainingProducts: remaining,
      });

      // Gọi API lấy sản phẩm bán chạy theo khoảng thời gian
      const bestSaleResponse = await ProductManagementApi.getBestSaleProduct({
        startDate,
        endDate,
      });
      setBestSellingProducts(bestSaleResponse.data);

      // Gọi API lấy thống kê khách hàng theo khoảng thời gian
      const customerResponse = await CustomerManagementApi.getLoyalCustomer({
        startDate,
        endDate,
      });
      const customerData = customerResponse.data;
      setCustomerStats({
        totalCustomersThisMonth: customerData.totalCustomersThisMonth || 0,
        topCustomers: customerData.topCustomers || [],
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu theo khoảng thời gian:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderNoData = () => (
    <div className={styles.noData}>
      <Empty description="Không có dữ liệu để hiển thị" />
    </div>
  );

  return (
    <div className={styles.analysisContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Thống kê & Phân tích</h1>
      </div>

      {/* Bộ lọc thời gian */}
      <div className={styles.filterContainer}>
        <span className={styles.filterLabel}>Khoảng thời gian:</span>
        <RangePicker
          onChange={handleDateChange}
          value={dateRange}
          format="DD/MM/YYYY"
          allowClear={true}
          style={{ width: "300px" }}
          placeholder={["Từ ngày", "Đến ngày"]}
        />
      </div>

      {/* Stat Cards */}
      <div className={styles.statCards}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#4F46E5" }}>
            📦
          </div>
          <div>
            <div className={styles.statLabel}>Tổng sản phẩm</div>
            <div className={styles.statValue}>{productStats.totalProducts}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#10B981" }}>
            ✅
          </div>
          <div>
            <div className={styles.statLabel}>Đã bán</div>
            <div className={styles.statValue}>{productStats.soldProducts}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#F43F5E" }}>
            🗃️
          </div>
          <div>
            <div className={styles.statLabel}>Tồn kho</div>
            <div className={styles.statValue}>
              {productStats.remainingProducts}
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#7C3AED" }}>
            📊
          </div>
          <div>
            <div className={styles.statLabel}>Tỷ lệ bán ra</div>
            <div className={styles.statValue}>
              {productStats.totalProducts > 0
                ? Math.round(
                    (productStats.soldProducts / productStats.totalProducts) *
                      100
                  )
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ sản phẩm */}
      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h3>Thống kê sản phẩm</h3>
          <div className={styles.chartContainer}>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Bar
                data={productStatsBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.chartBox}>
          <h3>Tỷ lệ sản phẩm bán ra</h3>
          <div className={styles.chartContainer}>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Pie
                data={productStatsPieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sản phẩm bán chạy & Báo cáo khách hàng */}
      <div className={styles.bottomRow}>
        {/* Sản phẩm bán chạy */}
        <div className={styles.bottomBox}>
          <h3>Sản phẩm bán chạy</h3>
          <div className={styles.bestSellingProducts}>
            {loading ? (
              <Spin size="large" />
            ) : bestSellingProducts.length === 0 ? (
              renderNoData()
            ) : (
              bestSellingProducts.map((product, idx) => (
                <div key={product.productId} className={styles.bestProductCard}>
                  <div
                    className={styles.bestProductRank}
                    style={{
                      background:
                        idx === 0
                          ? "linear-gradient(135deg, #FFD700, #FFB300)"
                          : idx === 1
                          ? "linear-gradient(135deg, #C0C0C0, #B0B0B0)"
                          : "linear-gradient(135deg, #CD7F32, #B87333)",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <img
                    className={styles.bestProductImg}
                    src={product.urlImg}
                    alt={product.productName}
                  />
                  <div className={styles.bestProductInfo}>
                    <div className={styles.bestProductName}>
                      {product.productName}
                    </div>
                    <div className={styles.bestProductSold}>
                      Đã bán:{" "}
                      <b>{product.totalSoldQuantity.toLocaleString("vi-VN")}</b>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Báo cáo khách hàng */}
        <div className={styles.bottomBox}>
          <h3>Báo cáo khách hàng</h3>
          <div className={styles.customerReportTotal}>
            Tổng khách hàng tháng này:{" "}
            <b>{customerStats?.totalCustomersThisMonth || 0}</b>
          </div>
          <div className={styles.topCustomersGrid}>
            {loading ? (
              <Spin size="large" />
            ) : customerStats?.topCustomers?.length === 0 ? (
              renderNoData()
            ) : (
              customerStats.topCustomers.map((customer, idx) => (
                <div key={customer.customerId} className={styles.customerCard}>
                  <div className={styles.cardHeader}>
                    <div
                      className={styles.rankBadge}
                      style={{
                        background:
                          idx === 0
                            ? "linear-gradient(135deg, #FFD700, #FFB300)"
                            : idx === 1
                            ? "linear-gradient(135deg, #C0C0C0, #B0B0B0)"
                            : "linear-gradient(135deg, #CD7F32, #B87333)",
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className={styles.customerName}>
                      {customer.customerName || "N/A"}
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.contactInfo}>
                      <span>{customer.phoneNumber || "N/A"}</span>
                      <span>{customer.email || "N/A"}</span>
                    </div>
                    <div className={styles.statsGrid}>
                      <div className={styles.statBox}>
                        <div className={styles.statTitle}>Tổng đơn hàng</div>
                        <div className={styles.statNumber}>
                          {customer.totalOrders || 0}
                        </div>
                      </div>
                      <div className={styles.statBox}>
                        <div className={styles.statTitle}>Tổng chi tiêu</div>
                        <div className={styles.statNumber}>
                          {(customer.totalSpent || 0).toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisManagement;
