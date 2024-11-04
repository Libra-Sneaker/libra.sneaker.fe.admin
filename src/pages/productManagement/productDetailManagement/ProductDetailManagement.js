import React, { useEffect, useState } from "react";
import styles from "./ProductDetailManagement.module.css";
import { Button, Input, Select } from "antd";
import { useNavigate } from "react-router";
import { BrandManagementApi } from "../../../api/admin/brandManagement/BrandManagementApi";
import { TypeOfShoeManagementApi } from "../../../api/admin/typeOfShoeManagement/TypeOfShoeManagementApi";
import { ColorManagementApi } from "../../../api/admin/colorManagemnet/ColorManagementApi";
import { MaterialManagementApi } from "../../../api/admin/materialManagement/MaterialManagementApi";
import { SizeManagementApi } from "../../../api/admin/sizeManagement/SizeManagementApi";

const ProductDetailManagement = (id) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/product-management"); // Quay lại trang trước đó
  };

  const [brandOptions, setBrandOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  const getBrand = async () => {
    try {
      const response = await BrandManagementApi.getBrands();
      setBrandOptions(
        response.data.map((brand) => ({
          value: brand.id,
          label: brand.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch brands", error);
    }
  };

  const getProductType = async () => {
    try {
      const response = await TypeOfShoeManagementApi.getTypeOfShoe();
      setTypeOptions(
        response.data.map((typeOfShoe) => ({
          value: typeOfShoe.id,
          label: typeOfShoe.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch type of shoe", error);
    }
  };

  const getColor = async () => {
    try {
      const response = await ColorManagementApi.getColor();
      setColorOptions(
        response.data.map((color) => ({
          value: color.id,
          label: color.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch type of shoe", error);
    }
  };

  const getMaterial = async () => {
    try {
      const response = await MaterialManagementApi.getMaterial();
      setMaterialOptions(
        response.data.map((material) => ({
          value: material.id,
          label: material.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch material", error);
    }
  };

  const getSize = async () => {
    try {
      const response = await SizeManagementApi.getSize();
      setSizeOptions(
        response.data.map((size) => ({
          value: size.id,
          label: size.name,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch size", error);
    }
  };

  useEffect(() => {
    getProductType();
    getBrand();
    getColor();
    getMaterial();
    getSize();
  }, []);

  const ListDropDown = [
    {
      name: "Danh mục",

      options: typeOptions,
    },
    {
      name: "Hãng Giày",
      options: brandOptions,
    },
    {
      name: "Màu sắc",
      options: colorOptions,
    },
    {
      name: "Chất liệu",
      options: materialOptions,
    },
    {
      name: "Size",
      options: sizeOptions,
    },
    {
      name: "Trạng thái",
      options: [
        {
          value: "1",
          label: "Còn hàng",
        },
        {
          value: "0",
          label: "Hết hàng",
        },
      ],
    },
  ];

  return (
    <div>
      <h1>Product Detail Management</h1>
      <Button
        type="default"
        onClick={handleBack}
        style={{ marginBottom: "16px" }}
      >
        Quay lại
      </Button>

      <div className={styles.containerSearch}>
        <div className={styles.InputSearch}></div>
        <div className={styles.selectSearch}>
          <div style={{
            display:"flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "10px",
    
            
          }} >
          <label>Tên sản phẩm</label>
          <Input placeholder="Tìm tên sản phẩm..." />
          </div>

          {ListDropDown.map((dropDown) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: "10px",
              }}
            >
              <label>{dropDown.name}</label>
              <Select
                onChange={(e) => console.log(e)}
                defaultValue={{
                  value: dropDown.id,
                  label: dropDown.name,
                }}
                style={{
                  width: 120,
                }}
                options={dropDown.options}
              />
            </div>
          ))}
        </div>

        <div className={styles.btnSearch}>
          <Button>Làm mới</Button>
          <Button type="primary">Tìm kiếm</Button>
        </div>
      </div>

      <div className={styles.containerTable}></div>
    </div>
  );
};

export default ProductDetailManagement;
