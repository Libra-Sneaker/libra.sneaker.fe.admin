import React, { useEffect, useState } from "react";
import styles from "./BillDetailManagement.module.css";
import { Button, Steps, Table, Tag } from "antd";
import { useNavigate, useParams } from "react-router";
import { BillManagementApi } from "../../../api/admin/billManagement/BillManagementApi";
import { BillHistoryManagementApi } from "../../../api/admin/billHistoryManagement/BillHistoryManagement";
import dayjs from "dayjs";
import { TransactionManagementApi } from "../../../api/admin/transactionManagement/TransactionManagementApi";
import moment from "moment/moment";
import { BillDetailsManagementApi } from "../../../api/admin/billDetailsManagement/BillDetailsManagementApi";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const BillDetailManagement = () => {
  const navigate = useNavigate();
  const { billId } = useParams();
  const [listBill, setListBill] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listBillHistory, setListBillHistory] = useState([]);
  const [listBillDetails, setListBillDetails] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [items, setItems] = useState([
    { title: "Tạo đơn hàng", subTitle: "Left 00:00:08", description: "" },
    { title: "Hoàn thành", subTitle: "Left 00:00:08", description: "" },
  ]);

  const [creatdDateBillHistory, setCreateDateBillHistory] = useState();
  const [discount, getDiscount] = useState(0);
  const [shippingFee, getShippingFee] = useState(0);

  const getBillHistory = async () => {
    try {
      setLoading(true);
      const response = await BillHistoryManagementApi.infoBillHistory(billId);
      setListBillHistory(response.data);
      console.log("listBillHistory after setting state:", response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Lấy thông tin Bill
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await BillManagementApi.infoBill(billId);
      setListBill(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getTransaction = async () => {
    try {
      setLoading(true);
      const response = await TransactionManagementApi.getTransaction(billId);
      setTransaction(response.data);
      console.log("transaction after setting state:", response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // lấy thông tin bill details
  const fetchBillDetails = async () => {
    try {
      setLoading(true);
      const response = await BillDetailsManagementApi.infoBillDetails(billId); // Corrected the method call
      setListBillDetails(response.data); // Update the list state
      console.log("listBillDetails after setting state:", response.data); // Debugging output
    } catch (error) {
      console.error("Failed to fetch bill details:", error); // Log the error
      // Optionally show an error message to the user
    } finally {
      setLoading(false); // Ensure loading is stopped
    }
  };

  // Khi component tải lên, lấy thông tin Bill và Bill History
  useEffect(() => {
    if (listBillHistory && listBillHistory.length > 0) {
      // Sắp xếp listBillHistory theo status từ nhỏ đến lớn
      const sortedHistory = [...listBillHistory].sort(
        (a, b) => a.status - b.status
      );

      const newItems = sortedHistory.map((history) => {
        let title = "";
        let description = "";
        let subTitle = "";

        // Xác định title và description dựa trên status
        switch (history.status) {
          case 0:
            title = "Tạo đơn hàng";
            description = "Tạo đơn hàng thành công";
            break;
          case 1:
            title = "Thanh toán đơn hàng";
            description = "Thanh toán đơn hàng thành công";
            break;
          case 2:
            title = "Đơn hàng bị hủy";
            description = "Đơn hàng bị hủy";
            break;
          default:
            title = "Trạng thái không xác định";
            description = "Không thể xác định trạng thái";
            break;
        }

        // Định dạng createdDate của chính đối tượng hiện tại
        subTitle = dayjs(history.createdDate).format("DD/MM/YYYY HH:mm:ss ");

        return {
          title,
          description,
          subTitle,
        };
      });

      // Cập nhật items với dữ liệu đã xử lý
      setItems(newItems);
    }
  }, [listBillHistory]);

  useEffect(() => {
    console.log("bill hítory");

    console.log(listBillHistory);

    console.log("bill details");

    console.log(listBillDetails);

    fetchData();
    getBillHistory();
    getTransaction();
    fetchBillDetails();
  }, []);

  const handleBack = () => {
    navigate("/bill-management"); // Quay lại trang trước đó
  };

  // Transaction
  const columns = [
    {
      title: "Số tiền",
      dataIndex: "money",
      key: "money",
      render: (money) => (
        <span>{new Intl.NumberFormat("vi-VN").format(money)} VND</span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => (
        <span>{dayjs(createdDate).format("DD/MM/YYYY HH:mm:ss")}</span>
      ),
    },

    {
      title: "Phương thức thanh toán",
      dataIndex: "typeMethod",
      key: "typeMethod",
      render: (typeMethod) => (
        <Tag
          color={typeMethod === 0 ? "green" : "blue"}
          style={{
            fontSize: "13px", // Tăng kích thước chữ
            padding: "5px 10px", // Tăng kích thước padding
          }}
        >
          {typeMethod === 0 ? "Tiền mặt" : "Chuyển khoản"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === 1 ? "green" : "red"}
          style={{
            fontSize: "13px", // Tăng kích thước chữ
            padding: "5px 10px", // Tăng kích thước padding
          }}
        >
          {status === 1 ? "Thành công" : "Đã hủy"}
        </Tag>
      ),
    },
    {
      title: "Nhân viên xác nhận",
      dataIndex: "employeeName",
      key: "employeeName",
    },
  ];

  // Calculate the total payment from the list of bill details
  const calculateTotalPrice = () => {
    return listBillDetails.reduce((total, item) => {
      if (item.price && item.quantity) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px",
        }}
      >
        <h2>Quản lý đơn hàng</h2>
        <Button
          type="default"
          onClick={handleBack}
          style={{ marginTop: "20px" }}
        >
          Quay lại
        </Button>
      </div>

      {/* BillHistory */}
      <div className={styles.Container}>
        <div className={styles.BillHistory}>
          <h3>Lịch sử đơn hàng</h3>

          <div
            style={{
              padding: "25px",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            <Steps current={items.length} items={items} />
          </div>
        </div>
      </div>

      {/* Bill */}
      <div className={styles.Container}>
        <div className={styles.BillInf}>
          <h3>Thông tin đơn hàng</h3>

          <div className={styles.ContentContainer}>
            <div>
              <label>Mã hóa đơn : </label>
              <span>{listBill?.code}</span>
            </div>

            <div>
              <label>Tên khách hàng : </label>
              <span>{listBill?.customerName}</span>
            </div>

            <div>
              <label>Trạng thái : </label>
              <Tag
                style={{
                  fontSize: "13px", // Tăng kích thước chữ
                  padding: "5px 10px", // Tăng kích thước padding
                }}
                color={
                  listBill?.status === 0
                    ? "red"
                    : listBill?.status === 1
                    ? "green"
                    : "default"
                }
              >
                {listBill?.status === 0
                  ? "Đã hủy"
                  : listBill?.status === 1
                  ? "Đã hoàn thành"
                  : "Trạng thái không xác định"}
              </Tag>
            </div>
          </div>
          <div className={styles.ContentContainer}>
            <div>
              <label>Số điện thoại người nhận : </label>
              <span>{listBill?.phoneNumber ?? "--"}</span>
            </div>

            <div>
              <label>Loại: </label>
              <span>
                {listBill?.type === "0" ? (
                  <Tag
                    color="gold"
                    style={{
                      fontSize: "13px", // Tăng kích thước chữ
                      padding: "5px 10px", // Tăng kích thước padding
                    }}
                  >
                    Tại quầy
                  </Tag>
                ) : listBill?.type === "1" ? (
                  <Tag
                    color="blue"
                    style={{
                      fontSize: "13px", // Tăng kích thước chữ
                      padding: "5px 10px", // Tăng kích thước padding
                    }}
                  >
                    Bán online
                  </Tag>
                ) : (
                  "--"
                )}
              </span>
            </div>

            <div>
              <label>Tên người nhận : </label>
              <span>{listBill?.recipient ?? "--"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction */}
      <div className={styles.Container}>
        <div className={styles.PaymentHistory}>
          <h3>Lịch sử thanh toán</h3>

          <div>
            <Table
              columns={columns}
              dataSource={transaction}
              pagination={false}
            />
          </div>
        </div>
      </div>

      {/* BillDetail */}
      <div className={styles.Container}>
        <h3>Danh sách sản phẩm</h3>
        <div className={styles.BillDetailContainer}>
          <div className={styles.BillDetail}>
            {listBillDetails && listBillDetails.length > 0 ? (
              listBillDetails.map((item) => (
                <div key={item.id} className={styles.BillDetailRow}>
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
                        src={item.urlImg}
                        alt={item.productName || "Bill Detail"}
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
                      <strong>Tên sản phẩm:</strong> {item.productName}
                    </p>
                    <p>
                      <strong>Giá:</strong>{" "}
                      {item.price ? item.price.toLocaleString() : "N/A"} VND
                    </p>
                    <p>
                      <strong>Size:</strong> {item.size || "N/A"}
                    </p>
                    <p>
                      <strong>Màu sắc:</strong> {item.color || "N/A"}
                    </p>
                  </div>
                  {/* Quantity Column */}
                  <div className={styles.BillDetailQuantity}>
                    <div
                      style={{
                        borderRadius: "40px",
                        border: " 1px solid #ccc",
                      }}
                    >
                      <div
                        style={{
                          margin: "5px",
                        }}
                      >
                        <MinusOutlined
                          style={{
                            margin: "5px",
                            fontSize: "10px",
                          }}
                        />
                        {item.quantity || "N/A"}
                        <PlusOutlined
                          style={{
                            margin: "5px",
                            fontSize: "10px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Total Price Column */}
                  <div className={styles.BillDetailTotal}>
                    <div>
                      {item.price && item.quantity
                        ? (item.price * item.quantity).toLocaleString()
                        : "N/A"}{" "}
                      VND
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có chi tiết nào để hiển thị</p>
            )}
          </div>
        </div>
      </div>

      {/* Thanhf tieenf */}
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
              <div className={styles.ToltalBillDetailsItems}>
                <span>Tổng tiền hàng:</span>{" "}
                {calculateTotalPrice().toLocaleString() ?? "--"} VND
              </div>
            </div>

            {/* Discount */}
            <div
              style={{
                marginTop: "5px",
                marginBottom: "5px",
              }}
            >
              <div className={styles.ToltalBillDetailsItems}>
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
              Miễn phí vận chuyển với đơn hàng có tổng tiền trên 1.000.000 VND
            </div>

            {/* Shipping Fee */}
            <div
              style={{
                marginTop: "5px",
                marginRight: "5px",
              }}
            >
              <div className={styles.ToltalBillDetailsItems}>
                <span>Phí vận chuyển:</span>
                {shippingFee.toLocaleString() ?? "--"} VND
              </div>
            </div>

            {/* Final Total */}

            <div className={styles.ToltalBillDetailsItems}>
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
                {calculateTotalPrice().toLocaleString() ?? "--"} VND
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetailManagement;
