import React, { useEffect, useState } from 'react';
import Search from 'antd/es/transfer/search';
import { Button } from 'antd';
import { useNavigate } from 'react-router';

const ProductDetailManagement = (id) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };
  return (
    <div>
    
      <h1>Product Detail Management</h1>
      <Button type="default" onClick={handleBack} style={{ marginBottom: "16px" }}>
        Quay lại
      </Button>
      <Search placeholder="input search text"  enterButton />
      <Search placeholder="input search text"  enterButton />
    </div>
  );
};

export default ProductDetailManagement;
