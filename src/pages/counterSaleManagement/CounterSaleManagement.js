import React, { useEffect, useState } from "react";
import styles from "./CounterSaleManagement.module.css";
import { Button, message, Modal, Table, Tabs } from "antd";
import { MinusOutlined, PlusOutlined, QrcodeOutlined } from "@ant-design/icons";
import { BillManagementApi } from "../../api/admin/billManagement/BillManagementApi";
import ModalAddProduct from "./modalAddProduct/ModalAddProduct";
import { BillDetailsManagementApi } from "../../api/admin/billDetailsManagement/BillDetailsManagementApi";

const CounterSaleManagement = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [billId, setBillId] = useState();

  const [billDetails, setBillDetails] = useState([]); // State lưu trữ danh sách sản phẩm trong hóa đơn
  const [billDetailsId, setBillDetailsId] = useState([]); 
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading

  const handleProductsSelected = (products) => {
    setSelectedProducts(products); // Cập nhật danh sách sản phẩm đã chọn
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Gọi API khi trang được tải để lấy các bill có status = 0
  useEffect(() => {
    const fetchBills = async () => {
      try {
        // Gọi API để lấy hóa đơn với status = 0
        const response = await BillManagementApi.getBillWithStatus(); // Gọi API với status = 0
        const bills = response.data; // Giả sử response trả về dữ liệu dưới dạng { data: [...] }

        if (bills && bills.length > 0) {
          const newTabs = bills.map((bill, index) => {
            return {
              key: `order-${index + 1}`,
              id: bill.id,
              label: `Đơn hàng ${index + 1} - ${bill.code}`, // Sử dụng mã hóa đơn cho tiêu đề tab
              content: (
                <div className={styles.ContentContainer}>
                  <h2>
                    Đơn hàng {index + 1} - {bill.code}{" "}
                  </h2>
                  <div>
                    <Button icon={<QrcodeOutlined />}>Quét QR sản phẩm</Button>
                    <Button
                      icon={<PlusOutlined />}
                      className={styles.ButtonAdd}
                      onClick={handleOpenModal}
                    >
                      Thêm sản phẩm
                    </Button>
                  </div>
                </div>
              ),
            };
          });

          setTabs(newTabs);
          setActiveTab(newTabs[0]?.key); // Set tab đầu tiên làm active
          setBillId(newTabs[0]?.id); // Đặt billId của tab đầu tiên
        } else {
          message.info("Hiện tại đang không có đơn hàng nào chờ");
        }
      } catch (error) {
        message.error("Lấy danh sách hóa đơn thất bại. Vui lòng thử lại.");
      }
    };

    fetchBills(); // Gọi hàm lấy danh sách hóa đơn khi trang được tải
  }, []);

  // Khi người dùng nhấp vào một tab, cập nhật active tab và log id
  const handleTabChange = (key) => {
    setActiveTab(key); // Cập nhật tab đang hoạt động
    const currentTab = tabs.find((tab) => tab.key === key); // Tìm tab theo key
    if (currentTab) {
      setBillId(currentTab.id); // Cập nhật billId
      console.log("ID của tab hiện tại:", currentTab.id); // Log ra id của tab
    }
  };

  // Hàm thêm tab mới khi tạo hóa đơn thành công
  const handleAddTab = async () => {
    if (tabs.length >= 5) {
      message.warning("Chỉ được tạo tối đa 5 đơn hàng!");
      return;
    }

    try {
      // Gọi API để tạo hóa đơn mới
      const billResponse = await BillManagementApi.create({});
      const { code } = billResponse.data;

      // Gọi lại API để lấy các bill có status = 0
      const billsResponse = await BillManagementApi.getBillWithStatus(0);
      const bills = billsResponse.data;

      console.log(billsResponse.data);

      // Tạo tab mới với mã hóa đơn vừa tạo
      const newTabs = bills.map((bill, index) => {
        return {
          key: `order-${index + 1}`,
          label: `Đơn hàng ${index + 1} - ${bill.code}`, // Sử dụng mã hóa đơn cho tiêu đề tab
          content: (
            <div className={styles.ContentContainer}>
              <h2>Sản phẩm</h2>
              <div>
                <Button icon={<QrcodeOutlined />}>Quét QR sản phẩm</Button>
                <Button
                  icon={<PlusOutlined />}
                  className={styles.ButtonAdd}
                  onClick={handleOpenModal}
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </div>
          ),
        };
      });

      setTabs(newTabs); // Cập nhật lại danh sách các tab
      setActiveTab(newTabs[0]?.key); // Set tab đầu tiên làm active
    } catch (error) {
      message.error("Tạo đơn hàng thất bại. Vui lòng thử lại.");
    }
  };

  const handleRemoveTab = async (targetKey) => {
    // Tìm tab bị xóa dựa trên targetKey
    const removedTab = tabs.find((tab) => tab.key === targetKey);

    if (removedTab) {
      // Sử dụng Modal.confirm để xác nhận xóa
      Modal.confirm({
        title: "Bạn có chắc chắn muốn xóa đơn hàng này?",
        content: `${removedTab.label} sẽ bị xóa.`,
        okText: "Xóa",
        cancelText: "Hủy",
        onOk: async () => {
          console.log("Removing Bill with ID:", removedTab.id); // Log ID của bill

          try {
            // Gọi API để cập nhật deleteFlag
            const response = await BillManagementApi.updateDeleteFlag(
              removedTab.id
            );
            console.log("API Response:", response);

            // Nếu API thành công, cập nhật lại danh sách tabs
            const filteredTabs = tabs.filter((tab) => tab.key !== targetKey);
            setTabs(filteredTabs);

            // Xử lý chuyển tab active
            if (activeTab === targetKey && filteredTabs.length > 0) {
              setActiveTab(filteredTabs[filteredTabs.length - 1].key);
            } else if (filteredTabs.length === 0) {
              setActiveTab(""); // Không còn tab nào
            }
          } catch (error) {
            console.error("Error updating deleteFlag:", error);
            message.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
          }
        },
        onCancel() {
          // Xử lý khi người dùng hủy bỏ
          console.log("Hủy bỏ xóa đơn hàng");
        },
      });
    }
  };

  // const columns = [
  //   { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
  //   { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
  //   { title: "Giá", dataIndex: "price", key: "price" },
  //   {
  //     title: "Thao tác",
  //     key: "action",
  //     render: (_, record) => (
  //       <Button
  //         onClick={() => {
  //           setTabs((prevTabs) =>
  //             prevTabs.map((t) =>
  //               t.key === activeTab
  //                 ? {
  //                     ...t,
  //                     products: t.products.filter(
  //                       (p) => p.productDetailId !== record.productDetailId
  //                     ),
  //                   }
  //                 : t
  //             )
  //           );
  //         }}
  //       >
  //         Xóa
  //       </Button>
  //     ),
  //   },
  // ];

  const getBillDetails = async () => {
    setLoading(true); // Bật trạng thái loading khi bắt đầu gọi API
    console.log("parma truyenf vao");

    console.log(billId);

    try {
      const response = await BillDetailsManagementApi.infoBillDetails(billId); // Gọi API để lấy chi tiết hóa đơn
      const { data } = response; // Giả sử API trả về dữ liệu trong trường 'data'

      // Cập nhật dữ liệu vào state
      setBillDetails(data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      message.error("Lấy chi tiết hóa đơn thất bại!");
    } finally {
      setLoading(false); // Tắt trạng thái loading khi kết thúc
    }
  };

  useEffect(() => {
    if (billId) {
      getBillDetails(); // Gọi API khi `billId` thay đổi
    }
  }, [billId]); // Gọi lại khi `billId` thay đổi


  const handleDeleteBillDetails = (product) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa chi tiết hóa đơn này?',
      content: 'Hành động này sẽ không thể phục hồi.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // Gọi API để xóa chi tiết hóa đơn
          const response = await BillDetailsManagementApi.updateDeleteFlag(product.id);
          console.log("API Response:", response);
  
          // Hiển thị thông báo thành công
          message.success("Xóa chi tiết hóa đơn thành công!");
  
          // Load lại danh sách dữ liệu sau khi xóa
          getBillDetails(); // Hàm để lấy lại dữ liệu chi tiết hóa đơn
        } catch (error) {
          console.error("Error deleting bill details:", error);
          message.error("Xóa chi tiết hóa đơn thất bại!");
        }
      },
      onCancel() {
        // Thực hiện khi người dùng hủy bỏ
        console.log("Hủy xóa");
      }
    });
  };
  

  return (
    <div className={styles.Container}>
      <div className={styles.HeaderContainer}>
        <h1>Bán hàng</h1>
        <Button
          icon={<PlusOutlined />}
          className={styles.ButtonAdd}
          onClick={handleAddTab}
          // disabled={tabs.length >= 5}
        >
          Tạo đơn hàng
        </Button>
      </div>

      <div className={styles.TabsContainer}>
        {tabs.length === 0 ? (
          <div className={styles.NoOrdersMessage}>
            Hiện chưa có đơn hàng nào cả!
          </div>
        ) : (
          <Tabs
            type="editable-card"
            activeKey={activeTab}
            onChange={handleTabChange}
            onEdit={(targetKey, action) => {
              if (action === "remove") {
                handleRemoveTab(targetKey); // Gọi hàm custom khi xóa tab
              }
            }}
            items={tabs.map((tab) => ({
              label: tab.label,
              // id: tab.id,
              key: tab.key,
              children: (
                <div >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center", 
                    margin:'10px'
                  }}>

                  <h2>{tab.label}</h2>
                  <Button
                    icon={<PlusOutlined />}
                    className={styles.ButtonAdd}
                    onClick={handleOpenModal}
                  >
                    Thêm sản phẩm
                  </Button>
                  </div>

                  {/* Danh sách sản phẩm đã chọn */}
                  <div style={{
                    margin:'10px'
                  }}>
                    {loading ? (
                      <div>Đang tải...</div> // Hiển thị khi đang tải dữ liệu
                    ) : (
                      (billDetails || []).map((product) => (
                        <div
                          key={product.productDetailId}
                          className={styles.ContainerItem}
                        >
                          {/* Image Column */}
                          <div className={styles.BillDetailImg}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={product.urlImg}
                                alt={product.productName || "Bill Detail"}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "10px",
                                }}
                              />
                            </div>
                          </div>

                          {/* Details Column */}
                          <div className={styles.BillDetailItems}>
                            <p>
                              <strong>Tên sản phẩm:</strong>{" "}
                              {product.productName}
                            </p>
                            <p>
                              <strong>Giá:</strong>{" "}
                              {product.price
                                ? product.price.toLocaleString()
                                : "N/A"}{" "}
                              VND
                            </p>
                            <p>
                              <strong>Size:</strong> {product.size || "N/A"}
                            </p>
                            <p>
                              <strong>Màu sắc:</strong> {product.color || "N/A"}
                            </p>
                          </div>

                          {/* Quantity Column */}
                          <div className={styles.BillDetailQuantity}>
                            <div
                              style={{
                                borderRadius: "40px",
                                border: "1px solid #ccc",
                              }}
                            >
                              <div style={{ margin: "5px" }}>
                                <MinusOutlined
                                  style={{ margin: "5px", fontSize: "10px" }}
                                />
                                {product.quantity || "N/A"}
                                <PlusOutlined
                                  style={{ margin: "5px", fontSize: "10px" }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Total Price Column */}
                          <div className={styles.BillDetailTotal}>
                            <div style={{ fontWeight: "bold", color: "red" }}>
                              {product.price && product.quantity
                                ? (
                                    product.price * product.quantity
                                  ).toLocaleString()
                                : "N/A"}{" "}
                              VND
                            </div>
                          </div>

                          <Button
                            className={styles.DeleteButton}
                            onClick={() => {
                              handleDeleteBillDetails(product)
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ),
            }))}
          />
        )}
      </div>

      <ModalAddProduct
        isModalOpen={isModalOpen}
        handleCancel={handleModalClose}
        billIdSelected={billId}
        getBillDetails={getBillDetails}
        onProductsSelected={(selectedProducts) => {
          setTabs((prevTabs) =>
            prevTabs.map((tab) =>
              tab.key === activeTab
                ? {
                    ...tab,
                    products: [...(tab.products || []), ...selectedProducts],
                  }
                : tab
            )
          );
        }}
      />
    </div>
  );
};

export default CounterSaleManagement;
