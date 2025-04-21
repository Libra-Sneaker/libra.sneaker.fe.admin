import React, { useEffect, useState } from "react";
import styles from "./CounterSaleManagement.module.css";
import {
  Avatar,
  Button,
  message,
  Modal,
  Select,
  Switch,
  Tabs,
  Tag,
} from "antd";
import {
  DollarOutlined,
  MinusOutlined,
  PlusOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { BillManagementApi } from "../../api/admin/billManagement/BillManagementApi";
import ModalAddProduct from "./modalAddProduct/ModalAddProduct";
import { BillDetailsManagementApi } from "../../api/admin/billDetailsManagement/BillDetailsManagementApi";
import ModalAddCustomer from "./modalAddCustomer/ModalAddCustomer";
import { CustomerManagementApi } from "../../api/admin/customerManagement/CustomerManagementApi";
import debounce from "lodash.debounce";
import ModalPayment from "./modalPayment/ModalPayment";
import { useNavigate } from "react-router";

const { Option } = Select;

const CounterSaleManagement = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCustomer, setIsModalOpenCustomer] = useState(false);
  const [isModalOpenPayment, setIsModalOpenPayment] = useState(false);

  const navigate = useNavigate();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [billId, setBillId] = useState();
  const [billDetails, setBillDetails] = useState([]); // State lưu trữ danh sách sản phẩm trong hóa đơn
  // const [billDetailsId, setBillDetailsId] = useState([]);
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading
  // const [quantityProductDetail, setQuantityProductDetail] = useState();

  const [discount, getDiscount] = useState(0);
  const [shippingFee, getShippingFee] = useState(0);

  const [searchResults, setSearchResults] = useState([]); // State để lưu kết quả tìm kiếm
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleProductsSelected = (products) => {
    setSelectedProducts(products); // Cập nhật danh sách sản phẩm đã chọn
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenModalCustomer = () => {
    setIsModalOpenCustomer(true);
  };

  const handleOpenModalPayment = () => {
    setIsModalOpenPayment(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalCloseCustomer = () => {
    setIsModalOpenCustomer(false);
  };

  const handleModalClosePayment = () => {
    setIsModalOpenPayment(false);
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
    console.log("haudshdsuhhaudshdsuh");

    if (tabs.length >= 5) {
      message.warning("Chỉ được tạo tối đa 5 đơn hàng!");
      return;
    }

    try {
      // Gọi API để tạo hóa đơn mới
      const billResponse = await BillManagementApi.create({});
      const { code, id } = billResponse.data; // Giả sử API trả về id và code

      // Gọi lại API để lấy các bill có status = 0
      const billsResponse = await BillManagementApi.getBillWithStatus(0);
      const bills = billsResponse.data;

      console.log(billsResponse.data);

      // Tạo tab mới với mã hóa đơn vừa tạo
      const newTabs = bills.map((bill, index) => {
        return {
          key: `order-${index + 1}`,
          id: bill.id, // Thêm id từ dữ liệu bill
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
      setBillId(newTabs[0]?.id); // Cập nhật billId cho tab mới
    } catch (error) {
      message.error("Tạo đơn hàng thất bại. Vui lòng thử lại.");
    }
  };

  const handleCompleteBill = async () => {
    if (!billId) {
      // message.error("Vui lòng chọn một đơn hàng!");
      return;
    }
    if (billDetails.length === 0) {
      // message.error("Hóa đơn chưa có sản phẩm!");
      return;
    }
    try {
      const totalAmount = calculateTotalPrice() + shippingFee - discount;
      const billUpdateData = {
        id: billId,
        totalAmount: totalAmount,
        customerId: selectedCustomer?.id || null,
        employeeId: "4f21e504-3b11-4b6b-90ac-37c814acb6f6", // Thay bằng giá trị thực tế nếu có
        status: 1,
        address: selectedCustomer?.address || "Khách lẻ",
        phoneNumber: selectedCustomer?.phoneNumber || "N/A",
        recipient: selectedCustomer?.name || "Khách lẻ",
        datePayment: new Date().toISOString(),
        billDetails: billDetails.map((detail) => ({
          id: detail.id,
          productDetailId: detail.productDetailId,
          quantity: detail.quantity,
          price: detail.price,
          deleteFlag: detail.deleteFlag || 0,
        })),
      };

      console.log("Sending bill update data:", billUpdateData); // Debug dữ liệu gửi đi

      const response = await BillManagementApi.update(billUpdateData);
      console.log("API response:", response); // Debug phản hồi từ API
      console.log("ddsdsdsd 11111:", response.data);
      console.log("ddsdsdsd 2222222222:", response.data.success);

      // Kiểm tra phản hồi từ API
      if (response.data) {
        if (
          typeof response.data === "string" &&
          response.data.includes("thành công")
        ) {
          // Thành công
          const filteredTabs = tabs.filter((tab) => tab.key !== activeTab);
          setTabs(filteredTabs);
          setActiveTab(filteredTabs.length > 0 ? filteredTabs[0].key : "");
          setBillId(filteredTabs.length > 0 ? filteredTabs[0].id : null);
          setBillDetails([]);
          setSelectedCustomer(null);
          message.success("Hoàn tất hóa đơn thành công!");
          await getBillDetails();
        } else if (response.data.success === false) {
          // Backend trả về lỗi
          message.error(response.data.message || "Hoàn tất hóa đơn thất bại!");
        } else {
          // Phản hồi không có success (chuỗi hoặc định dạng khác)
          message.success(response.data || "Hoàn tất hóa đơn thành công!");
        }
      } else {
        // Nếu response.data không tồn tại (API trả về không đúng định dạng)
        message.success("Hoàn tất hóa đơn thành công!");
      }
    } catch (error) {
      console.error("Error completing bill:", error.response || error);
      message.error(
        error.response?.data?.message || "Hoàn tất hóa đơn thất bại!"
      );
    }
  };

  // Hàm xử lý thêm hoặc xóa tab
  const handleTabEdit = (targetKey, action) => {
    if (action === "add") {
      handleAddTab(); // Gọi hàm thêm tab khi nhấp vào icon dấu cộng
    } else if (action === "remove") {
      handleRemoveTab(targetKey); // Gọi hàm xóa tab
    }
  };

  const handleRemoveTab = async (targetKey) => {
    // Tìm tab bị xóa dựa trên targetKey
    const removedTab = tabs.find((tab) => tab.key === targetKey);

    if (removedTab) {
      // Sử dụng Modal.confirm để xác nhận xóa
      Modal.confirm({
        title: "Bạn có chắc chắn muốn xóa đơn hàng này?",
        content: `${removedTab.label} sẽ bị xóa hoàn toàn, số lượng sản phẩm sẽ được trả lại kho.`,
        okText: "Xóa",
        cancelText: "Hủy",
        onOk: async () => {
          console.log("Removing Bill with ID:", removedTab.id);

          try {
            // Bước 1: Lấy danh sách chi tiết hóa đơn của bill
            const billDetailsResponse =
              await BillDetailsManagementApi.infoBillDetails(removedTab.id);
            const billDetailsToDelete = billDetailsResponse.data || [];

            // Bước 2: Xóa từng chi tiết hóa đơn để trả lại số lượng sản phẩm trong kho
            if (billDetailsToDelete.length > 0) {
              await Promise.all(
                billDetailsToDelete.map(async (product) => {
                  await BillDetailsManagementApi.updateDeleteFlag(product.id);
                })
              );
              console.log(
                "Đã xóa tất cả chi tiết hóa đơn và trả lại số lượng trong kho."
              );
            } else {
              console.log("Không có chi tiết hóa đơn nào để xóa.");
            }

            // Bước 3: Đánh dấu bill là đã xóa
            const response = await BillManagementApi.updateDeleteFlag(
              removedTab.id
            );
            console.log("API Response (Bill Deletion):", response);

            // Bước 4: Cập nhật lại danh sách tabs
            const filteredTabs = tabs.filter((tab) => tab.key !== targetKey);
            setTabs(filteredTabs);

            // Xử lý chuyển tab active và billId
            if (activeTab === targetKey && filteredTabs.length > 0) {
              setActiveTab(filteredTabs[filteredTabs.length - 1].key);
              setBillId(filteredTabs[filteredTabs.length - 1].id);
            } else if (filteredTabs.length === 0) {
              setActiveTab(""); // Không còn tab nào
              setBillId(null); // Reset billId
              setBillDetails([]); // Reset danh sách chi tiết hóa đơn
            }

            message.success(
              "Xóa đơn hàng thành công, số lượng sản phẩm đã được trả lại kho!"
            );
          } catch (error) {
            console.error("Error removing bill and details:", error);
            message.error("Xóa đơn hàng thất bại. Vui lòng thử lại.");
          }
        },
        onCancel() {
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
      console.log("bill details");

      console.log(data);
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
    handleCompleteBill();
  }, [billId]); // Gọi lại khi `billId` thay đổi

  const handleDeleteBillDetails = (product) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa chi tiết hóa đơn này?",
      content: "Hành động này sẽ không thể phục hồi.",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // Gọi API để xóa chi tiết hóa đơn
          const response = await BillDetailsManagementApi.updateDeleteFlag(
            product.id
          );
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
      },
    });
  };

  const handleQuantityChange = async (product, change) => {
    // Lấy số lượng hiện tại từ state hoặc từ product
    const currentDetail = billDetails.find(
      (detail) => detail.productDetailId === product.productDetailId
    );

    const currentQuantity = currentDetail
      ? currentDetail.quantity
      : product.quantity;

    const newQuantity = currentQuantity + change; // Số lượng mới, chỉ tăng hoặc giảm 1

    // Kiểm tra số lượng hợp lệ
    if (newQuantity < 1) {
      message.warning("Số lượng không thể nhỏ hơn 1.");
      return;
    }

    // Không cho phép tăng nếu số lượng trong kho đã bằng 0
    if (change > 0 && product.productDetailQuantity === 0) {
      message.warning("Số lượng sản phẩm trong kho hiện không đủ.");
      return;
    }

    // Thông tin cần gửi tới backend
    const param = {
      productDetailId: product.productDetailId,
      quantity: change, // Chỉ gửi sự thay đổi (+1 hoặc -1)
      billId: billId,
    };

    console.log("Sending to backend:", param);

    try {
      // Gọi API cập nhật số lượng
      await BillDetailsManagementApi.create(param);

      // Hiển thị thông báo thành công
      message.success("Cập nhật số lượng thành công!");

      // Gọi lại hàm `getBillDetails` để làm mới dữ liệu
      await getBillDetails();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);

      // Kiểm tra lỗi và hiển thị modal nếu lỗi là "Số lượng sản phẩm trong kho không đủ"
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Số lượng sản phẩm trong kho không đủ!"
      ) {
        Modal.error({
          title: "Lỗi cập nhật số lượng",
          content:
            "Hiện số lượng sản phẩm này trong kho không đủ, vui lòng chọn sản phẩm khác!",
        });
      } else {
        message.error("Cập nhật số lượng thất bại!");
      }
    } finally {
      // Luôn gọi lại `getBillDetails` để đảm bảo dữ liệu được làm mới
      await getBillDetails();
    }
  };

  const fetchAllCustomers = async () => {
    try {
      setLoading(true);
      const response = await CustomerManagementApi.search(); // API lấy toàn bộ khách hàng
      const customers = Array.isArray(response.data.content)
        ? response.data.content
        : [];
      console.log(customers);

      setSearchResults(customers); // Lưu danh sách vào state
    } catch (error) {
      console.error("Error fetching customer list:", error);
      message.error("Lỗi khi lấy danh sách khách hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce(async (value) => {
    try {
      setLoading(true);
      console.log("Searching for:", value); // Log giá trị tìm kiếm

      // Gọi API với tham số tìm kiếm
      const filter = { searchTerm: value }; // Chuyển value thành tham số tìm kiếm
      const response = await CustomerManagementApi.search(filter); // Gọi API tìm kiếm

      // Kiểm tra dữ liệu trả về
      if (response && response.data && response.data.content) {
        const customers = Array.isArray(response.data.content)
          ? response.data.content
          : [];
        setSearchResults(customers); // Cập nhật state với kết quả tìm kiếm
      } else {
        setSearchResults([]); // Nếu không có dữ liệu, gán mảng rỗng
      }
    } catch (error) {
      console.error("Error fetching customer list:", error);
      message.error("Lỗi khi lấy danh sách khách hàng.");
    } finally {
      setLoading(false);
    }
  }, 500); // Debounce sau 500ms

  const handleFocus = async () => {
    if (searchResults.length === 0) {
      await fetchAllCustomers(); // Lấy danh sách khách hàng khi người dùng focus vào ô
    }
  };

  // Khi người dùng chọn một khách hàng
  const handleSelectCustomer = (customerId) => {
    const customer = searchResults.find((c) => c.id === customerId);
    setSelectedCustomer(customer); // Lưu khách hàng đã chọn vào state
  };

  // Khi xóa khách hàng đã chọn
  const handleDeselectCustomer = () => {
    setSelectedCustomer(null); // Xóa khách hàng đã chọn
  };

  // Calculate the total payment from the list of bill details
  const calculateTotalPrice = () => {
    return billDetails.reduce((total, item) => {
      if (item.price && item.quantity) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
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
            type="editable-card" // Hiển thị icon dấu cộng và xóa
            activeKey={activeTab}
            onChange={handleTabChange} // Chuyển đổi tab
            onEdit={handleTabEdit} // Thêm hoặc xóa tab
            items={tabs.map((tab) => ({
              label: tab.label,
              // id: tab.id,
              key: tab.key,
              children: (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "10px",
                    }}
                  >
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
                  <div
                    style={{
                      margin: "10px",
                    }}
                  >
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
                                  onClick={() =>
                                    handleQuantityChange(product, -1)
                                  }
                                  style={{ margin: "5px", fontSize: "10px" }}
                                />
                                {product.quantity || "N/A"}
                                <PlusOutlined
                                  onClick={() =>
                                    handleQuantityChange(product, 1)
                                  }
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
                              handleDeleteBillDetails(product);
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      ))
                    )}

                    {/* Thông tin khách hàng */}
                    <div className={styles.Container}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div className={styles.TotalMoneyLeft}>
                          <strong>Thông tin khách hàng</strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginLeft: "20px",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {/* Hiển thị thông tin khách hàng đã chọn bên ngoài ô input */}
                            {selectedCustomer ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginRight: "20px", // Khoảng cách giữa thông tin khách hàng và Select
                                }}
                              >
                                <Avatar
                                  src={
                                    selectedCustomer.avatar ||
                                    "https://via.placeholder.com/40"
                                  }
                                  size={40}
                                />
                                <div style={{ marginLeft: "10px" }}>
                                  <div style={{ fontWeight: "bold" }}>
                                    {selectedCustomer.name}
                                  </div>
                                  <div style={{ color: "#888" }}>
                                    {selectedCustomer.phoneNumber}
                                  </div>
                                </div>
                                <Button
                                  onClick={handleDeselectCustomer}
                                  style={{ marginLeft: "20px" }}
                                  danger
                                >
                                  Xóa
                                </Button>
                              </div>
                            ) : (
                              // Dropdown Tìm kiếm chỉ hiển thị khi chưa chọn khách hàng
                              <Select
                                showSearch
                                placeholder="Tìm kiếm khách hàng"
                                style={{ width: "100%" }}
                                onSearch={(value) => {
                                  console.log("Input value:", value); // Log giá trị người dùng nhập
                                  handleSearch(value); // Gọi hàm handleSearch
                                }}
                                onFocus={fetchAllCustomers} // Gọi API để lấy tất cả khách hàng khi focus
                                loading={loading}
                                onChange={handleSelectCustomer}
                                optionFilterProp="label" // Use 'label' to filter options
                                filterOption={(input, option) =>
                                  option?.label
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              >
                                {searchResults.length > 0 ? (
                                  searchResults.map((customer) => (
                                    <Option
                                      key={customer.id}
                                      value={customer.id}
                                      label={`${customer.name} - ${customer.phoneNumber}`}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "10px",
                                        }}
                                      >
                                        <Avatar
                                          src={
                                            customer.avatar ||
                                            "https://via.placeholder.com/40"
                                          }
                                          size={40}
                                        />
                                        <div>
                                          <div style={{ fontWeight: "bold" }}>
                                            {customer.name}
                                          </div>
                                          <div style={{ color: "#888" }}>
                                            {customer.phoneNumber}
                                          </div>
                                        </div>
                                      </div>
                                    </Option>
                                  ))
                                ) : (
                                  <Option disabled>No customers found</Option>
                                )}
                              </Select>
                            )}
                          </div>

                          <Button
                            className={styles.ButtonAdd}
                            icon={<PlusOutlined />}
                            onClick={handleOpenModalCustomer}
                          >
                            Thêm khách hàng
                          </Button>
                        </div>
                      </div>

                      {/* Thông tin khách */}
                      {/* Phần hiển thị thông tin khách hàng đã chọn */}
                      <div
                        style={{
                          width: "300px",
                          marginTop: "20px",
                        }}
                      >
                        {/* Kiểm tra nếu có khách hàng được chọn */}
                        {selectedCustomer ? (
                          <>
                            <div className={styles.TotalMoneyItemLeft}>
                              <div>Tên khách hàng</div>
                              <Tag>{selectedCustomer?.name}</Tag>
                            </div>

                            <div className={styles.TotalMoneyItemLeft}>
                              <div>Email</div>
                              <div>{selectedCustomer?.email || "N/A"}</div>
                            </div>

                            <div className={styles.TotalMoneyItemLeft}>
                              <div>Giới tính</div>
                              <div>
                                {selectedCustomer?.sex === 1
                                  ? "Nam"
                                  : "Nữ" || "N/A"}
                              </div>
                            </div>

                            <div className={styles.TotalMoneyItemLeft}>
                              <div>Số điện thoại</div>
                              <div>
                                {selectedCustomer?.phoneNumber || "N/A"}
                              </div>
                            </div>

                            <div className={styles.TotalMoneyItemLeft}>
                              <div>Địa chỉ</div>
                              <div>{selectedCustomer?.address || "N/A"}</div>
                            </div>
                          </>
                        ) : (
                          /* Hiển thị mặc định khi không chọn khách hàng */
                          <>
                            <div className={styles.TotalMoneyItemLeft}>
                              <div>Tên khách hàng</div>
                              <Tag>Khác lẻ</Tag>
                            </div>

                            <div className={styles.TotalMoneyItemLeft}>
                              <div>Giao hàng</div>
                              <Switch />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className={styles.Container}>
                        <div className={styles.ToltalBillDetails}>
                          <div
                            style={{
                              width: "280px",
                            }}
                          >
                            {/* Total Item Price */}
                            <div
                              style={{
                                marginTop: "5px",
                                marginBottom: "5px",
                              }}
                            >
                              <div className={styles.TotalMoneyItemRight}>
                                <span>Tổng tiền hàng:</span>{" "}
                                {calculateTotalPrice().toLocaleString() ?? "--"}{" "}
                                VND
                              </div>
                            </div>

                            {/* Discount */}
                            <div
                              style={{
                                marginTop: "5px",
                                marginBottom: "5px",
                              }}
                            >
                              <div className={styles.TotalMoneyItemRight}>
                                <span>Giảm giá:</span>
                                {discount.toLocaleString() ?? "--"} VND
                              </div>
                            </div>

                            <div
                              style={{
                                fontSize: "12px",
                                margin: "10px",
                                fontStyle: "italic",
                              }}
                            >
                              Miễn phí vận chuyển với đơn hàng có tổng tiền trên
                              1.000.000 VND
                            </div>

                            {/* Shipping Fee */}
                            <div
                              style={{
                                marginTop: "5px",
                                marginRight: "5px",
                              }}
                            >
                              <div className={styles.TotalMoneyItemRight}>
                                <span>Phí vận chuyển:</span>
                                {shippingFee.toLocaleString() ?? "--"} VND
                              </div>
                            </div>

                            <div className={styles.TotalMoneyItemRight}>
                              Phương thức thanh toán :
                            </div>

                            <div
                              style={{
                                backgroundColor: "white",
                                borderRadius: "5px",
                                padding: "10px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#000",
                              }}
                            >
                              {/* Tiền mặt */}
                              <div
                                style={{
                                  border: "1px solid #ccc",
                                  borderRadius: "5px",
                                  padding: "10px",
                                  display: "flex",
                                  cursor: "pointer",
                                }}
                                onClick={handleOpenModalPayment}
                              >
                                Tiền mặt & Chuyển khoản
                                <DollarOutlined
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "5px",
                                  }}
                                />
                              </div>
                            </div>

                            {/* Tổng tiển thanh toán */}
                            <div className={styles.TotalMoneyItemRight}>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  marginRight: "5px",
                                  marginTop: "10px",
                                }}
                              >
                                <strong>Tổng tiền thanh toán: </strong>
                              </div>

                              <div
                                style={{
                                  margin: "10px",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {calculateTotalPrice().toLocaleString() ?? "--"}{" "}
                                VND
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Button tạo hóa đơn */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: "10px",
                          marginRight: "10px",
                        }}
                      >
                        <Button
                          onClick={handleCompleteBill}
                          className={styles.ButtonAdd}
                        >
                          Tạo hóa đơn
                        </Button>
                      </div>
                    </div>
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

      <ModalAddCustomer
        isModalOpenCustomer={isModalOpenCustomer}
        handleCancelCustomer={handleModalCloseCustomer}
      />

      <ModalPayment
        isModalOpenPayment={isModalOpenPayment}
        handleCancelPayment={handleModalClosePayment}
        calculateTotalPrice={calculateTotalPrice}
        billId={billId}
      />
    </div>
  );
};

export default CounterSaleManagement;
