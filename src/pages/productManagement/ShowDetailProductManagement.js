import React, { useState } from "react";
import styles from "./ShowDetailProductManagement.module.css";
import { Form, Input, Select, Slider, Table } from "antd";

const columns = [
  {
    title: "Ảnh",
    dataIndex: "image",
    // render: (text) => <a>{text}</a>,
  },
  {
    title: "Id",
    dataIndex: "id",
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
  },
  {
    title: "Danh mục",
    dataIndex: "category",
  },
  {
    title: "Chất liệu",
    dataIndex: "material",
  },
  {
    title: "Màu sắc",
    dataIndex: "color",
  },
  {
    title: "Size",
    dataIndex: "size",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Giá",
    dataIndex: "price",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
  {
    title: "Hoạt động",
    dataIndex: "action",
  },
];


// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

// Type:
// useState dataType:
/**
 * name:
 * option:[{
 * id:
 * name:
 * }]
 *
 *
 */

// Type, Material, Brand, Size, Color
// id, name, option,
/**
 * 
 *ListBrand =  select name from Brand
 *ListType =  select name from Type
 * Api = {
    * [
        * {
        *   id:"123"
        *   name:"Type"
        *   option: ListType
        * },
        *  * {
        *   id:"124"
        *   name:"Brand"
        *   option: ListBrand
        * },
    * ]
 * }
 * 
 * return Api
 * */



const OptionsDanhMuc = [
  {
    value: "Giày thể thao",
    label: "Giày thể thao",
  },
  {
    value: "Giày Luxury",
    label: "Giày Luxury",
  },
]

const ListDropDown = [
  {
    name: "Danh mục",
    
    options: OptionsDanhMuc
  },
  {
    name: "Hãng Giày",
    options: [
      {
        value: "Nike",
        label: "Nike",
      },
      {
        value: "Adidas",
        label: "Adidas",
      },
    ],
  },
  {
    name: "Màu sắc",
    options: [
      {
        value: "Đỏ",
        label: "Đỏ",
      },
      {
        value: "Trắng",
        label: "Trắng",
      },
      {
        value: "Đen",
        label: "Đen",
      },
      {
        value: "Xanh",
        label: "Xanh",
      },
    ],
  },
  {
    name: "Chất liệu",
    options: [
      {
        value: "Vải",
        label: "Vải",
      },
      {
        value: "Da",
        label: "Da",
      },
    ],
  },
  {
    name: "Size",
    options: [
      {
        value: "36",
        label: "36",
      },
      {
        value: "37",
        label: "37",
      },
      {
        value: "38",
        label: "38",
      },
      {
        value: "39",
        label: "39",
      },
      {
        value: "40",
        label: "40",
      },
      {
        value: "41",
        label: "41",
      },
      {
        value: "42",
        label: "42",
      },
    ],
  },
  {
    name: "Trạng thái",
    options: [
      {
        value: "Còn hàng",
        label: "Còn hàng",
      },
      {
        value: "Hết hàng",
        label: "Hết hàng",
      },
    ],
  },
];

const ShowDetailProductManagement = () => {
  const [form] = Form.useForm();
  const onChange = (value) => {
    console.log("onChange: ", value);
  };
  const onChangeComplete = (value) => {
    console.log("onChangeComplete: ", value);
  };
  const handleChange = (value) => {
    console.log(value);
  };
  const [selectionType] = useState("checkbox");
  return (
    <div className={styles.container}>
      <h2>Sản phẩm &gt; Chi tiết sản phẩm</h2>
      <div className={styles.searchDetailProduct}>
        <div className={styles.formSearchDetailProduct}>
          <Form form={form} style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              style={{ width: "50%", paddingTop: "20px" }}
              label="Tìm kiếm"
              name="search"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập vào loại giày cần tìm!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ width: "50%", marginRight: "30px", paddingTop: "20px" }}
              label="Giá từ :"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá từ!" }]}
            >
              <Slider
                range
                step={10}
                defaultValue={[0, 50]}
                onChange={onChange}
                onChangeComplete={onChangeComplete}
              />
            </Form.Item>
          </Form>
          <div
            style={{
              display: "flex",
              gap: "60px",
              textAlign: "center",
              justifyContent: "center",
              paddingBottom: "10px",
            }}
          >
            {ListDropDown.map((dropDown) => (
              <Select
                labelInValue
                defaultValue={{
                  value: dropDown.name,
                  label: dropDown.name,
                }}
                style={{
                  width: 120,
                }}
                onChange={handleChange}
                options={dropDown.options}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.showDetailProduct}>
        <h3>Danh sách sản phẩm</h3>
        <div>
          <Table
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowDetailProductManagement;
