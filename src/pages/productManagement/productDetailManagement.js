import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductManagementApi } from '../../api/admin/productManagement/ProductManagementApi';
import Search from 'antd/es/transfer/search';

const ProductDetailManagement = (id) => {
 
  return (
    <div>
    
      <h1>Product Detail Management</h1>
      <Search placeholder="input search text"  enterButton />
      <Search placeholder="input search text"  enterButton />
    </div>
  );
};

export default ProductDetailManagement;
