import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  DatePicker,
  Input,
  Radio,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import styles from "./BillManagement.module.css";
import { Navigate, useNavigate } from "react-router";
import { BillManagementApi } from "../../api/admin/billManagement/BillManagementApi";
import dayjs from "dayjs";

const BillManagement = () => {
  const [listBill, setListBill] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const [searchBill, setSearchBill] = useState({
    page: 0,
    size: 10,
    searchTerm: "",
  });
  const [status, setStatus] = useState(null);

  const { RangePicker } = DatePicker;
  const [datePaymentStart, setDatePaymentStart] = useState(null);
  const [datePaymentEnd, setDatePaymentEnd] = useState(null);
  const dateFormat = "YYYY-MM-DD";
  const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;

  const columns = [
    { title: "STT", dataIndex: "rowNum", key: "rowNum" },
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tổng sản phẩm",
      dataIndex: "totalProduct",
      key: "totalProduct",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "datePayment",
      key: "datePayment",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (text) => 
        text === 1 ? (
          <Tag color="green" className={styles.largeTag}>
            Đã hoàn thành
          </Tag>
        ) : null,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => navigate(`/bill-detail-management/${record.id}`)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = async (page = 1, size = 10) => {
    console.log(`Fetching page: ${page}, size: ${size}`);
    
    setLoading(true);
    const params = {
      page: page - 1,
      size: size,
    };

    try {
      const response = await BillManagementApi.search(params);
      console.log("Response data:", response.data);
      setListBill(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Lấy giá trị input
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Lấy name và value của input
    setSearchBill((prevState) => ({
      ...prevState,
      [name]: value, // Cập nhật giá trị tương ứng với name của input
    }));
  };

  // Lấy giá trị ngày
  const   handleRangeChange = (dates, dateStrings) => {
    if (dates) {
      setDatePaymentStart(dateStrings[0]); // Lấy giá trị ngày bắt đầu
      setDatePaymentEnd(dateStrings[1]); // Lấy giá trị ngày kết thúc
    } else {
      setDatePaymentStart(null);
      setDatePaymentEnd(null);
    }
  };

  // btn search
  const handleSearch = async () => {
    console.log(searchBill);
    // Ép kiểu deleteFlag sang số, nếu deleteFlag là rỗng hoặc null thì để undefined
    const parsedStatus =
      status !== "" && status !== null ? parseInt(status, 10) : undefined;
    console.log("status: " + parsedStatus);

    // Giá trị ngày bắt đầu và kết thúc

    console.log("Start date:");
    console.log(datePaymentStart);

    console.log("End date:");
    console.log(datePaymentEnd);

    const params = {
      page: searchBill.page,
      size: searchBill.size,
      searchTerm: searchBill.searchTerm,
      status: parsedStatus,
      datePaymentStart: datePaymentStart,
      datePaymentEnd: datePaymentEnd,
    };
    
    console.log(params);

    try {
      const response = await BillManagementApi.search(params);
      setListBill(response.data.content);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    
    
  };

  return (
    <div>
      <h1>Danh sách hóa đơn</h1>
      <div>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "20px",
            boxShadow: "0px 0px 5px 0px #ccc",
          }}
          className={styles.SearchContainer}
        >
          {/* top conrainer */}
          <div className={styles.TopContainer}>
            <div>
              <Input
                style={{
                  width: "500px",
                }}
                placeholder="Tìm kiếm ..."
                name="searchTerm" // Đặt name cho input
                value={searchBill.searchTerm}
                onChange={handleInputChange}
              ></Input>
            </div>
            <div>
              <Button
                style={{
                  marginRight: "20px",
                }}
              >
                Quét mã QR
              </Button>
              <Button>Tạo hóa đơn</Button>
            </div>
          </div>

          {/* bottom container */}
          <div className={styles.BottomContainer}>
            <div>
              <RangePicker
                defaultValue={null} // Không chọn giá trị mặc định
                format={dateFormat}
                onChange={handleRangeChange}
              />
            </div>
            <div className={styles.radioContainer}>
              <span className={styles.statusLabel}>Trạng thái: </span>
              <Radio.Group
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <Radio value="">Tất cả</Radio>
                <Radio value="0">Đã hủy</Radio>
                <Radio value="1">Đã hoàn thành</Radio>
              </Radio.Group>
            </div>
            <div>
              <Button
                style={{
                  marginRight: "20px",
                }}
                type="primary"
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
              <Button>Export Excel</Button>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "20px",
            boxShadow: "0px 0px 5px 0px #ccc",
          }}
        >
          <Table
            loading={loading}
            columns={columns}
            dataSource={listBill}
            rowKey="id"
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default BillManagement;
