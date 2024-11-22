import React, { useEffect, useState } from "react";
import styles from "./ModalConfirmAddProductBill.module.css";
import { message, Modal } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BillDetailsManagementApi } from "../../../../api/admin/billDetailsManagement/BillDetailsManagementApi";

const ModalConfirmAddProductBill = ({
  isModalOpendExtra,
  handleCancelExtra,
  selectedProduct,
  billIdSelectedDetail,
  getBillDetails
}) => {
  const [quantity, setQuantity] = useState(1);

  // Hàm xử lý giảm số lượng
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1)); // Đảm bảo quantity >= 1
  };

  // Hàm xử lý tăng số lượng
  const increaseQuantity = () => {
    if (quantity + 1 > selectedProduct.quantity) {
      // Kiểm tra nếu số lượng vượt quá kho
      message.warning("Số lượng sản phẩm trong kho không đủ!"); // Hiển thị thông báo
    } else {
      setQuantity((prevQuantity) => prevQuantity + 1); // Tăng số lượng nếu hợp lệ
    }
  };
  // Reset quantity về 1 khi modal đóng
  useEffect(() => {
    if (!isModalOpendExtra) {
      setQuantity(1); // Reset quantity
    }
  }, [isModalOpendExtra]);

  useEffect(() => {
    console.log(selectedProduct);
  }, [selectedProduct]);

  const handleOk = () => {
    // Xác nhận người dùng có chắc chắn muốn thêm sản phẩm không
    Modal.confirm({
      title: "Bạn có chắc chắn muốn thêm sản phẩm này vào hóa đơn?",
      centered: true,
      onOk: async () => {
        const params = {
          productDetailId: selectedProduct.productDetailId,
          quantity: quantity, // Thêm số lượng được chọn
          price: selectedProduct.price, // Thêm giá sản phẩm
          billId: billIdSelectedDetail, // Thêm id của hóa đơn
        };

        console.log(params);

        try {
          // Gọi API để tạo BillDetail
          const createBillDetail = await BillDetailsManagementApi.create(
            params
          );

          // Kiểm tra kết quả và thông báo thành công
          if (createBillDetail) {
            message.success("Thêm sản phẩm vào hóa đơn thành công!");
          }
        } catch (error) {
          message.error("Thêm sản phẩm vào hóa đơn thất bại!"); // Hiển thị thông báo lỗi nếu có
        }
        getBillDetails();

        handleCancelExtra(); // Đóng modal sau khi thao tác xong
      },
      onCancel() {
        console.log("Người dùng đã hủy việc thêm sản phẩm"); // Thực hiện hành động nếu người dùng hủy
      },
    });
  };

  return (
    <Modal
      title={
        `Sản phẩm ` +
        selectedProduct.productName +
        ` " ` +
        selectedProduct.colorName +
        ` "`
      }
      open={isModalOpendExtra}
      onOk={handleOk}
      onCancel={handleCancelExtra}
      width={800}
      centered = {true}

    >
      <div className={styles.Container}>
        {selectedProduct ? (
          <div className={styles.ContainerItems}>
            {/* Image Column */}
            <div className={styles.BillDetailImg}>
              <img
                src={selectedProduct.urlImg}
                alt={selectedProduct.productName || "Bill Detail"}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
            {/* Details Column */}
            <div className={styles.BillDetailItems}>
              <p>
                <strong>Giá:</strong>{" "}
                {selectedProduct.price
                  ? selectedProduct.price.toLocaleString()
                  : "N/A"}{" "}
                VND
              </p>
              <p>
                <strong>Size:</strong> {selectedProduct.sizeName || "N/A"}
              </p>
              <p>
                <strong>Màu sắc:</strong> {selectedProduct.colorName || "N/A"}
              </p>
              <p>
                <strong>Sản phẩm trong kho:</strong> {selectedProduct.quantity}
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
                      marginRight: "10px",
                    }}
                    onClick={decreaseQuantity}
                  />
                  {quantity}
                  <PlusOutlined
                    style={{
                      margin: "5px",
                      fontSize: "10px",
                      marginLeft: "10px",
                    }}
                    onClick={increaseQuantity}
                  />
                </div>
              </div>
            </div>
            {/* Total Price Column */}
            <div className={styles.BillDetailTotal}>
              <div>
                {selectedProduct.price && selectedProduct.quantity
                  ? (selectedProduct.price * quantity).toLocaleString()
                  : "N/A"}{" "}
                VND
              </div>
            </div>
          </div>
        ) : (
          <p>Chưa chọn sản phẩm</p>
        )}
      </div>
    </Modal>
  );
};

export default ModalConfirmAddProductBill;
