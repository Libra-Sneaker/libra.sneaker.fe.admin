import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Để lấy ID và điều hướng
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Select,
  InputNumber,
  Checkbox,
  Table,
  message,
  Spin, // Thêm Spin để hiển thị loading
  Row, // Thêm Row, Col để chia layout
  Col,
  Divider,
} from "antd";
import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./CouponDetailManagement.module.css"; // Tạo file CSS riêng
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CouponManagementApi } from "../../../api/admin/couponManagement/CouponManagementApi"; // API Coupon
import { CustomerManagementApi } from "../../../api/admin/customerManagement/CustomerManagementApi"; // API Customer

dayjs.extend(utc);

const { RangePicker } = DatePicker;
const { Option } = Select;

const CouponDetailManagement = () => {
  const { id: couponIdFromUrl } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // State cho nút submit
  const [listCustomer, setListCustomer] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Có thể không cần nếu dùng listSelectRow
  // const [selectedCustomers, setSelectedCustomers] = useState([]); // Có thể không cần

  const [listSelectRow, setListSelectRow] = useState([]); // Track selected rows as an array of customer IDs
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // Form state variables
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minCondition, setMinCondition] = useState("");
  // Lưu trữ đối tượng dayjs thay vì chuỗi để dễ định dạng
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Existing state variables
  const [type, setType] = useState(1); // 1: Public, 0: Personal
  const [searchTerm, setSearchTerm] = useState(""); // State cho tìm kiếm khách hàng
  const [currentPage, setCurrentPage] = useState(1);
  const [unit, setUnit] = useState(0); // 0: percent (%), 1: amount (VND) - Đổi tên từ init

  const [dataCoupon, setDataCoupon] = useState("");

  const { RangePicker } = DatePicker;

  // --- Logic chọn khách hàng (handleSelectAllChange, handleCheckboxChange) giữ nguyên ---
  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAllChecked(isChecked);
    if (isChecked) {
      setListSelectRow(listCustomer.map((item) => item.id)); // Chọn tất cả ID
    } else {
      setListSelectRow([]); // Bỏ chọn tất cả
    }
  };

  const handleCheckboxChange = (record) => {
    const id = record.id;
    const isSelected = listSelectRow.includes(id);
    if (isSelected) {
      setListSelectRow(listSelectRow.filter((rowId) => rowId !== id)); // Bỏ chọn
    } else {
      setListSelectRow([...listSelectRow, id]); // Chọn
    }
    // Cập nhật lại trạng thái của checkbox "Chọn tất cả"
    setSelectAllChecked(
      listSelectRow.length + (isSelected ? -1 : 1) === listCustomer.length &&
        listCustomer.length > 0
    );
  };

  // Cập nhật useEffect để kiểm tra lại selectAllChecked khi listSelectRow thay đổi
  useEffect(() => {
    console.log("couponIdFromUrl", couponIdFromUrl);

    setSelectAllChecked(
      listCustomer.length > 0 && listSelectRow.length === listCustomer.length
    );
    console.log("selectAllCheck: ", selectAllChecked);
  }, [listSelectRow, listCustomer]);

  // --- State tìm kiếm khách hàng ---
  const [searchCustomerParams, setSearchCustomerParams] = useState({
    page: 0,
    size: 10,
    searchTerm: "", // Thêm state này nếu bạn muốn tìm kiếm KH
  });

  // Replace navigate with a simple function that logs the action
  const handleCancel = () => {
    navigate("/promotion-management");
  };

  // Handle form submission
  const handleSubmit = async () => {
    // --- Validation cơ bản ---
    if (!code || !name || !value || !quantity || !startDate || !endDate) {
      message.error(
        "Vui lòng nhập đầy đủ thông tin bắt buộc (Mã, Tên, Giá trị, Số lượng, Thời gian)."
      );
      return;
    }
    // Kiểm tra giá trị là số
    if (isNaN(Number(value)) || Number(value) <= 0) {
      message.error("Giá trị giảm giá phải là số và lớn hơn 0.");
      return;
    }
    if (unit === 0 && Number(value) > 100) {
      message.error("Giá trị giảm giá theo % không được vượt quá 100.");
      return;
    }
    if (maxValue && (isNaN(Number(maxValue)) || Number(maxValue) < 0)) {
      message.error("Giá trị tối đa phải là số và không âm.");
      return;
    }
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      message.error("Số lượng phải là số nguyên và lớn hơn 0.");
      return;
    }
    if (
      minCondition &&
      (isNaN(Number(minCondition)) || Number(minCondition) < 0)
    ) {
      message.error("Điều kiện tối thiểu phải là số và không âm.");
      return;
    }
    if (type === 0 && listSelectRow.length === 0) {
      message.error("Vui lòng chọn ít nhất một khách hàng cho coupon cá nhân.");
      return;
    }

    // --- Định dạng dữ liệu cho API ---
    const formattedStartDate = startDate
      ? dayjs(startDate).utc().format()
      : null; // ISO 8601 UTC
    const formattedEndDate = endDate ? dayjs(endDate).utc().format() : null; // ISO 8601 UTC

    const customerDetailPayload =
      type === 0 // Chỉ gửi khi là coupon cá nhân
        ? listSelectRow.map((customerId) => ({ customerId: customerId }))
        : null; // Hoặc [] nếu backend yêu cầu mảng rỗng

    const payload = {
      id: couponIdFromUrl,
      code,
      name,
      value: Number(value),
      unit: unit, // Sử dụng tên 'unit' giống backend DTO
      maxValue: unit === 0 ? (maxValue ? Number(maxValue) : null) : null, // Chỉ gửi nếu là % và có giá trị
      quantity: parseInt(quantity, 10), // Chuyển sang số nguyên
      minCondition: minCondition ? Number(minCondition) : null, // Chỉ gửi nếu có giá trị
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      type: type,
      customerDetail: customerDetailPayload, // Đã định dạng
    };

    console.log("Sending Payload:", payload);
    setLoadingSubmit(true); // Bắt đầu loading

    try {
      // Gọi API để tạo coupon
      const response = await CouponManagementApi.update(payload);
      console.log("API Response:", response);
      message.success("Cập nhật phiếu giảm giá thành công!"); // Thông báo thành công
      setCode("");
      setName("");
      setValue("");
      setMaxValue("");
      setQuantity("");
      setMinCondition("");
      setStartDate(null);
      setEndDate(null);
      setType(1);
      setUnit(0);
      setListSelectRow([]);
      setSelectAllChecked(false);
    } catch (error) {
      console.error("Error creating coupon:", error);
      // Hiển thị lỗi cụ thể từ backend nếu có
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi khi tạo phiếu giảm giá.";
      message.error(errorMessage); // Thông báo lỗi
      console.log(errorMessage);
    } finally {
      setLoadingSubmit(false); // Kết thúc loading
    }
  };

  // --- Columns cho bảng khách hàng (giữ nguyên) ---
  const columns = [
    {
      title: (
        <Checkbox
          onChange={handleSelectAllChange}
          checked={selectAllChecked}
          disabled={listCustomer.length === 0} // Disable nếu không có KH
        />
      ),
      key: "checkBox",
      render: (_, record) => (
        <Checkbox
          onChange={() => handleCheckboxChange(record)}
          checked={listSelectRow.includes(record.id)}
        />
      ),
      width: "5%",
    },
    {
      title: "Mã KH",
      dataIndex: "customerCode", // Giả sử có trường 'code' hoặc 'customerCode'
      key: "code",
      width: "15%",
    },
    {
      title: "Tên KH",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
      width: "25%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "25%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "20%",
    },
  ];

  // --- Fetch dữ liệu khách hàng ---
  const fetchData = async (page = 1, size = 10, term = "") => {
    console.log(
      `Workspaceing data - Page: ${page}, Size: ${size}, Term: ${term}, Coupon ID: ${couponIdFromUrl}`
    );
    setLoading(true);

    const paramsCustomer = {
      page: page - 1,
      size: size,
      searchTerm: term,
    };

    const paramCoupon = {
      page: 0, // Thường lấy trang đầu tiên khi chỉ tìm theo ID
      size: 100, // Lấy đủ lớn để chứa hết các customerId nếu API trả về nhiều dòng
      couponId: couponIdFromUrl,
    };

    try {
      // Gọi cả hai API song song để tiết kiệm thời gian (tùy chọn)
      const [responseCustomer, responseCoupon] = await Promise.all([
        CustomerManagementApi.search(paramsCustomer),
        CouponManagementApi.searchCoupon(paramCoupon), // Giả sử API này trả về danh sách các dòng khớp với couponId
      ]);

      console.log("Customer Response data:", responseCustomer.data?.content);
      console.log("Coupon Response data:", responseCoupon.data?.content);

      const currentCustomers = responseCustomer.data?.content || [];
      const totalCustomerItems = responseCustomer.data?.totalElements || 0;
      const couponEntries = responseCoupon.data?.content || []; // Đây có thể là mảng các dòng dữ liệu coupon/customer

      // Cập nhật danh sách khách hàng và tổng số lượng cho bảng
      setListCustomer(currentCustomers);
      setTotalItems(totalCustomerItems);

      let initiallySelectedIds = []; // Mảng để lưu các ID cần chọn ban đầu

      if (couponEntries.length > 0) {
        // Lấy thông tin coupon chính từ dòng đầu tiên (giả sử các thông tin cơ bản giống nhau)
        const couponData = couponEntries[0];
        console.log("Processing Coupon Data (first entry):", couponData);

        // Cập nhật state cho các trường của form (như code cũ)
        setCode(couponData.code || "");
        setName(couponData.name || "");
        setValue(couponData.value?.toString() || "");
        // Quan trọng: Đảm bảo setUnit và setType trước khi xử lý logic chọn KH
        setUnit(couponData.unit ?? 0); // Dùng ?? để nếu null/undefined thì mặc định là 0 (%)
        setType(couponData.type ?? 1); // Dùng ?? để nếu null/undefined thì mặc định là 1 (Công khai)
        setMaxValue(couponData.maxValue?.toString() || "");
        setQuantity(couponData.quantity?.toString() || "");
        setMinCondition(couponData.minCondition?.toString() || "");
        // Nên dùng dayjs.utc() nếu backend trả về UTC string hoặc đảm bảo múi giờ nhất quán
        setStartDate(
          couponData.startDate ? dayjs.utc(couponData.startDate) : null
        );
        setEndDate(couponData.endDate ? dayjs.utc(couponData.endDate) : null);

        // --- LOGIC CHỌN KHÁCH HÀNG TỰ ĐỘNG ---
        if (couponData.type === 0) {
          // Chỉ xử lý nếu là coupon cá nhân
          // Lấy tất cả customerId từ các dòng coupon trả về
          const associatedCustomerIds = couponEntries
            .map((entry) => entry.customerId) // Trích xuất customerId từ mỗi dòng
            .filter((id) => id != null); // Loại bỏ các giá trị null hoặc undefined

          console.log(
            "Associated Customer IDs from Coupon API:",
            associatedCustomerIds
          );

          // Lấy ID của các khách hàng đang hiển thị trên trang hiện tại
          const currentPageCustomerIds = currentCustomers.map(
            (cust) => cust.id
          );

          // Tìm những customerId liên kết nào có trong trang khách hàng hiện tại
          initiallySelectedIds = associatedCustomerIds.filter((assocId) =>
            currentPageCustomerIds.includes(assocId)
          );

          console.log(
            "Initially selecting IDs (present on current page):",
            initiallySelectedIds
          );
        }
        // --- KẾT THÚC LOGIC CHỌN KHÁCH HÀNG ---
      } else {
        // Xử lý trường hợp không tìm thấy dữ liệu coupon
        console.warn("No coupon data found for ID:", couponIdFromUrl);
        message.error("Không tìm thấy thông tin phiếu giảm giá.");
        // Có thể reset form ở đây nếu muốn
        setCode("");
        setName("");
        setValue("");
        setMaxValue("");
        setQuantity("");
        setMinCondition("");
        setStartDate(null);
        setEndDate(null);
        setType(1); // Reset về public
        setUnit(0); // Reset về %
      }

      // Cập nhật state listSelectRow với các ID đã tìm được
      setListSelectRow(initiallySelectedIds);
      // State selectAllChecked sẽ tự động cập nhật nhờ useEffect đã có
    } catch (error) {
      console.error("Error fetching data: ", error);
      message.error("Lỗi khi tải dữ liệu phiếu giảm giá hoặc khách hàng.");
      setListCustomer([]);
      setTotalItems(0);
      setListSelectRow([]); // Đảm bảo reset lựa chọn khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]); // Thêm searchTerm vào dependency

  // --- Các hàm xử lý thay đổi input (handleVoucherTypeChange, handleDiscountTypeChange, handleSearchChange) ---
  const handleVoucherTypeChange = (newType) => {
    setType(newType);
    // Nếu chuyển sang public, xóa danh sách khách hàng đã chọn
    if (newType === 1) {
      setListSelectRow([]);
      setSelectAllChecked(false);
    }
  };

  const handleDiscountTypeChange = (newUnit) => {
    setUnit(newUnit);
    // Nếu đổi sang VND, xóa giá trị max value
    if (newUnit === 1) {
      setMaxValue("");
    }
  };

  // Xử lý thay đổi input tìm kiếm khách hàng
  const handleSearchTermChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
    // Không cần gọi fetchData ở đây vì useEffect sẽ tự động gọi khi searchTerm thay đổi
  };

  // Xử lý phân trang cho bảng khách hàng
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    // fetchData sẽ được gọi bởi useEffect
  };

  return (
    <div className={styles.couponContainer}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span
          className={styles.breadcrumbLink}
          onClick={() => navigate("/promotion-management")}
        >
          Phiếu giảm giá
        </span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbItemActive}>
          Cập nhật phiếu giảm giá
        </span>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formSection}>
          {/* Bố cục 2 cột nếu là coupon cá nhân */}
          <div
            className={`${styles.mainLayout} ${
              type === 0 ? styles.twoColumnLayout : ""
            }`}
          >
            {/* Cột thông tin coupon */}
            <div className={`${styles.formColumn} ${styles.couponInfoColumn}`}>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Thông tin phiếu giảm giá</h2>
                <div className={styles.formDivider}></div>
              </div>

              {/* Mã và Tên */}
              <div className={styles.formGroupRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Mã phiếu giảm giá <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    // placeholder="Nhập mã phiếu (vd: SUMMER2025)"
                    className={styles.formControl}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())} // Tự động viết hoa
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Tên phiếu giảm giá{" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    // placeholder="Nhập tên phiếu giảm giá"
                    className={styles.formControl}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Giá trị và Giá trị tối đa */}
              <div className={styles.formGroupRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Giá trị <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWithSelect}>
                    <input
                      type="number" // Đổi thành number để dễ validate
                      min="0"
                      // placeholder={unit === 0 ? "10" : "100000"}
                      className={styles.formControlWithSelect}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <div className={styles.selectType}>
                      <select
                        className={styles.discountTypeSelect}
                        value={unit}
                        onChange={(e) =>
                          handleDiscountTypeChange(Number(e.target.value))
                        }
                      >
                        <option value={0}>%</option>
                        <option value={1}>VND</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Chỉ hiển thị Max Value khi unit là % */}
                {unit === 0 && (
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Giá trị tối đa (VND)
                    </label>
                    <div className={styles.inputWithIcon}>
                      <input
                        type="number"
                        min="0"
                        // placeholder="300000"
                        className={styles.formControl}
                        value={maxValue}
                        onChange={(e) => setMaxValue(e.target.value)}
                      />
                      <span className={styles.inputIcon}>đ</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Số lượng và Điều kiện */}
              <div className={styles.formGroupRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Số lượng <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWithIcon}>
                    <input
                      type="number"
                      min="1" // Số lượng ít nhất là 1
                      // placeholder="20"
                      className={styles.formControl}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <span className={styles.inputIcon}>#</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Điều kiện tối thiểu (VND)
                  </label>
                  <div className={styles.inputWithIcon}>
                    <input
                      type="number"
                      min="0"
                      // placeholder="100000"
                      className={styles.formControl}
                      value={minCondition}
                      onChange={(e) => setMinCondition(e.target.value)}
                    />
                    <span className={styles.inputIcon}>đ</span>
                  </div>
                </div>
              </div>

              {/* Thời gian áp dụng */}
              <div className={styles.datePickerWrapper}>
                <label className={styles.dateLabel}>
                  Thời gian áp dụng <span className={styles.required}>*</span>
                </label>
                <RangePicker
                  className={styles.datePicker}
                  format="DD/MM/YYYY HH:mm:ss" // Thêm giờ phút giây
                  showTime // Cho phép chọn giờ
                  placeholder={["Từ ngày", "Đến ngày"]}
                  allowClear
                  suffixIcon={<CalendarOutlined style={{ color: "#1890ff" }} />}
                  popupClassName={styles.datePopup}
                  style={{ width: "100%" }}
                  // Giá trị nhận vào là mảng [dayjsObject, dayjsObject]
                  value={
                    startDate && endDate
                      ? [dayjs(startDate), dayjs(endDate)]
                      : null
                  }
                  onChange={(dates) => {
                    // dates là mảng [dayjsObject1, dayjsObject2] hoặc null
                    if (dates && dates.length === 2) {
                      setStartDate(dates[0]); // Lưu đối tượng dayjs
                      setEndDate(dates[1]); // Lưu đối tượng dayjs
                    } else {
                      setStartDate(null);
                      setEndDate(null);
                    }
                  }}
                />
              </div>

              {/* Kiểu phiếu giảm giá */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kiểu phiếu giảm giá</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioContainer}>
                    <input
                      type="radio"
                      name="voucherType" // Cùng name để chọn 1
                      value={1} // Public
                      checked={type === 1}
                      onChange={() => handleVoucherTypeChange(1)}
                    />
                    <span className={styles.radioCustom}></span>
                    Công khai
                  </label>
                  <label className={styles.radioContainer}>
                    <input
                      type="radio"
                      name="voucherType" // Cùng name
                      value={0} // Personal
                      checked={type === 0}
                      onChange={() => handleVoucherTypeChange(0)}
                    />
                    <span className={styles.radioCustom}></span>
                    Cá nhân
                  </label>
                </div>
              </div>
            </div>

            {/* Cột danh sách khách hàng (chỉ hiển thị khi type là cá nhân) */}
            {type === 0 && (
              <div
                className={`${styles.formColumn} ${styles.customerListColumn}`}
              >
                <h2 className={styles.cardTitle}>Danh sách khách hàng</h2>
                {/* Thêm ô tìm kiếm khách hàng */}
                <div className={styles.searchCustomer}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng (mã, tên, sđt, email)..."
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    className={styles.formControl}
                  />
                </div>
                <Table
                  columns={columns}
                  dataSource={listCustomer}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                  }}
                  onChange={handleTableChange} // Xử lý thay đổi trang/kích thước trang
                  scroll={{ y: 300 }} // Giới hạn chiều cao và cho phép cuộn
                  size="small"
                />
              </div>
            )}
          </div>

          {/* Nút bấm */}
          <div className={styles.buttonContainer}>
            <button
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={loadingSubmit} // Disable khi đang gửi
            >
              HỦY
            </button>
            <button
              className={styles.addButton}
              onClick={handleSubmit}
              disabled={loadingSubmit} // Disable khi đang gửi
              // loading={loadingSubmit} // Thuộc tính loading của Antd Button (nếu dùng)
            >
              Hoàn Tất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponDetailManagement;
