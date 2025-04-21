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
  useEffect(() => {
    const fetchProductStatistics = async () => {
      try {
        const response = await ProductManagementApi.getProductStatistics();
        const data = response.data;

        // Lấy soldProducts và remainingProducts từ API
        const sold = data.soldProducts || 0;
        const remaining = data.remainingProducts || 0;

        // Tính toán totalProducts = soldProducts + remainingProducts
        const calculatedTotal = sold + remaining;

        setProductStats({
          totalProducts: calculatedTotal,
          soldProducts: sold,
          remainingProducts: remaining,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductStatistics();
  }, []);

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

  // Xử lý thay đổi ngày
  const handleDateChange = (dates) => {
    setDateRange(dates);
    // Thêm logic để lấy dữ liệu dựa trên khoảng ngày
  };

  const renderNoData = () => (
    <div className={styles.noData}>
      <Empty description="Không có dữ liệu để hiển thị" />
    </div>
  );

  return (
    <div className={styles.analysisContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Thống kê và phân tích</h1>
      </div>

      <div className={styles.filterContainer}>
        <span className={styles.filterLabel}>Khoảng thời gian:</span>
        <RangePicker onChange={handleDateChange} />
      </div>

      <div className={styles.statCards}>
        <div className={styles.statCard}>
          <div className={styles.label}>Tổng sản phẩm</div>
          <div className={styles.value}>{productStats.totalProducts}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>Sản phẩm đã bán</div>
          <div className={styles.value}>{productStats.soldProducts}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>Sản phẩm tồn kho</div>
          <div className={styles.value}>{productStats.remainingProducts}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>Tỷ lệ bán ra</div>
          <div className={styles.value}>
            {productStats.totalProducts > 0
              ? Math.round(
                  (productStats.soldProducts / productStats.totalProducts) * 100
                )
              : 0}
            %
          </div>
        </div>
      </div>

      <div className={styles.itemContainer}>
        {/* Phần Sản phẩm với biểu đồ cột */}
        <div className={styles.item}>
          <h3>Thống kê sản phẩm</h3>
          <div className={styles.chartContainer}>
            {loading ? (
              <Spin size="large" />
            ) : productStats.totalProducts === 0 ? (
              renderNoData()
            ) : (
              <Bar
                data={productStatsBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Số lượng",
                        font: {
                          weight: "bold",
                        },
                        color: colors.dark,
                      },
                      grid: {
                        color: "rgba(0, 0, 0, 0.04)",
                      },
                      ticks: {
                        color: colors.gray,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: colors.gray,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                      padding: 12,
                      titleFont: {
                        size: 14,
                      },
                      bodyFont: {
                        size: 13,
                      },
                      titleColor: "#fff",
                      bodyColor: "#fff",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderWidth: 1,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Phần Doanh thu */}
        <div className={styles.item}>
          <h3>Tỷ lệ sản phẩm bán ra</h3>
          <div className={styles.chartContainer}>
            {loading ? (
              <Spin size="large" />
            ) : productStats.totalProducts === 0 ? (
              renderNoData()
            ) : (
              <Pie
                data={productStatsPieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 20,
                        font: {
                          size: 12,
                        },
                        color: colors.dark,
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                      padding: 12,
                      titleFont: {
                        size: 14,
                      },
                      bodyFont: {
                        size: 13,
                      },
                      titleColor: "#fff",
                      bodyColor: "#fff",
                      callbacks: {
                        label: function (context) {
                          const label = context.label || "";
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce(
                            (a, b) => a + b,
                            0
                          );
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.itemContainer}>
        {/* Phần Sản phẩm bán chạy */}
        <div className={styles.item}>
          <h3>Sản phẩm bán chạy</h3>
          <div className={styles.chartContainer}>
            {renderNoData()} {/* Thay thế bằng dữ liệu thực tế khi có */}
          </div>
        </div>

        {/* Phần Báo cáo khách hàng */}
        <div className={styles.item}>
          <h3>Báo cáo khách hàng</h3>
          <div className={styles.chartContainer}>
            {renderNoData()} {/* Thay thế bằng dữ liệu thực tế khi có */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisManagement;
