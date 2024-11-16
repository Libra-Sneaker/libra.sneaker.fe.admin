import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Select, Space, Table, Tag } from 'antd'
import moment from 'moment';
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router';

const BillManagement = () => {
  const [listbill, setListBill] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const columns = [
    { title: "STT", dataIndex: "rowNum", key: "row" },
    {
      title: "Tên sản phẩm",
      dataIndex: "billName",
      key: "billName",
      
    },
    {
      title: "Tổng sản phẩm",
      dataIndex: "billName",
      key: "billName",
      
    },
    {
      title: "Tổng tiền",
      dataIndex: "billName",
      key: "billName",
      
    },
    {
      title: "Tên khách hàng",
      dataIndex: "billName",
      key: "billName",
      
    },
    {
      title: "Ngày thêm",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    { title: "Số lượng", dataIndex: "totalQuantity", key: "totalQuantity" },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => Navigate(`/bill-detail-management/${record.id}`)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>

      <div>
      <Table
            loading={loading}
            columns={columns}
            // dataSource={listEmployees} 
            rowKey="id"
            pagination={false}
          />
      </div>
    </div>
  )
}

export default BillManagement