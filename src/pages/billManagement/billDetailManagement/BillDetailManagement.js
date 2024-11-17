import React, { useEffect, useState } from "react";
import styles from "./BillDetailManagement.module.css";
import { Button, Steps, Tag } from "antd";
import { useNavigate, useParams } from "react-router";
import { BillManagementApi } from "../../../api/admin/billManagement/BillManagementApi";
import { BillHistoryManagementApi } from "../../../api/admin/billHistoryManagement/BillHistoryManagement";
import dayjs from "dayjs";

const BillDetailManagement = () => {
  const navigate = useNavigate();
  const { billId } = useParams();
  const [listBill, setListBill] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listBillHistory, setListBillHistory] = useState([]);
  const [items, setItems] = useState([
    { title: "Tạo đơn hàng", subTitle: "Left 00:00:08", description: "" },
    { title: "Hoàn thành", subTitle: "Left 00:00:08", description: "" },
  ]);

  const [creatdDateBillHistory, setCreateDateBillHistory] = useState();

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

   // Cập nhật items với dữ liệu từ listBillHistory
   useEffect(() => {
    if (listBillHistory && listBillHistory.length > 0) {
      // Sắp xếp listBillHistory theo status từ nhỏ đến lớn (0 -> 1 -> 2)
      const sortedHistory = [...listBillHistory].sort((a, b) => a.status - b.status);
      
      const newItems = [];

      // Lặp qua listBillHistory đã sắp xếp
      sortedHistory.forEach((history) => {
        let title = "";
        let description = "";

        // Xử lý dựa trên status và gán createdDate vào subTitle
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
            description = "Trạng thái không xác định";
        }

        // Gán createdDate vào subTitle
        newItems.push({
          title,
          description,
          subTitle: dayjs(history.createdDate).format("DD/MM/YYYY HH:mm"), // Định dạng ngày giờ của createdDate
        });
      });

      setItems(newItems); // Cập nhật items với dữ liệu đã xử lý
    }
  }, [listBillHistory]);  



  useEffect(() => {
    console.log("bill hítory");

    console.log(listBillHistory);

    fetchData();
    getBillHistory();
  }, []);

  const handleBack = () => {
    navigate("/bill-management"); // Quay lại trang trước đó
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
            <Steps current={items.length-1} items={items} />
          </div>
        </div>
      </div>

      {/* Bill */}
      <div className={styles.Container}>
        <div className={styles.BillInf}>
          <h3>Thông tin đơn hàng</h3>

          <div className={styles.BillContainer}>
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
          <div className={styles.BillContainer}>
            <div>
              <label>Số điện thoại người nhận : </label>
              <span>{listBill?.phoneNumber ?? "--"}</span>
            </div>

            <div>
              <label>Loại: </label>
              <span>
                {listBill?.type === "0" ? (
                  <Tag color="gold">Tại quầy</Tag>
                ) : listBill?.type === "1" ? (
                  <Tag color="blue">Bán online</Tag>
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

      {/* PaymentHistory */}
      <div className={styles.Container}>
        <div className={styles.PaymentHistory}>
          <h3>Lịch sử thanh toán</h3>
        </div>
      </div>

      {/* BillDetail */}
      <div className={styles.Container}>
        <div className={styles.BillDetail}>
          <h3>Danh sách sản phẩm</h3>
        </div>
      </div>
    </div>
  );
};

export default BillDetailManagement;
