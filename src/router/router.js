import DefaultLayout from "../layout/DefaultLayout";
import MiddlewareRouter from "../middleware/AuthGuard";
import NotAuthorized from "../pages/401";
import Forbidden from "../pages/403";
import NotFound from "../pages/404";
import Oops from "../pages/500";
import BrandManagement from "../pages/brandManagement/BrandManagement";
import NotAceptable from "../pages/not-aceptable";
import React from "react";
import { Navigate } from "react-router-dom";
import { SCREEN } from "./screen";
import ProductManagement from "../pages/productManagement/ProductManagement";
import MaterialManagement from "../pages/materialManagement/MaterialManagement";
import TypeOfShoeManagement from "../pages/typeOfShoeManagement/TypeOfShoeManagement";
import AddProductManagement from "../pages/productManagement/addProduct/AddProductManagement";
import ProductDetailManagement from "../pages/productManagement/productDetailManagement/ProductDetailManagement";
import EmployeeManagement from "../pages/employeeManagement/EmployeeManagement";
import AddEmployee from "../pages/employeeManagement/addEmployee/AddEmployee";
import CustomerManagement from "../pages/customerManagement/CustomerManagement";
import ModalAddCustomer from "../pages/customerManagement/addCustomer/AddCustomer";
import BillManagement from "../pages/billManagement/BillManagementt";
import BillDetailManagement from "../pages/billManagement/billDetailManagement/BillDetailManagement";

const generalRoutes = [
  { path: "*", element: <NotFound /> },
  { path: "/not-found", element: <NotFound /> },
  { path: "/not-authorization", element: <NotAuthorized /> },
  { path: "/forbidden", element: <Forbidden /> },
  { path: "/error", element: <Oops /> },
  { path: "/not-aceptable/*", element: <NotAceptable /> },
];

const adminRoutes = [
  { path: "/", element: <Navigate replace to={SCREEN.productManagement.path} /> },
  {
    
    path: SCREEN.brandManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <BrandManagement />
        </DefaultLayout>
      </MiddlewareRouter>
    ),
    
  },

  {
    path: SCREEN.productManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <ProductManagement />
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.productDetailManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <ProductDetailManagement/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.materialManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <MaterialManagement/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.typeOfShoeManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <TypeOfShoeManagement/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.addProductManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <AddProductManagement/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.employeeManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <EmployeeManagement/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.addEmployee.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <AddEmployee/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.customerManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <CustomerManagement/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.addCustomer.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <ModalAddCustomer/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.billManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <BillManagement/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },

  {
    path: SCREEN.billDetailManagement.path,
    element: (
      <MiddlewareRouter>
        <DefaultLayout>
          <BillDetailManagement/>
        </DefaultLayout>
      </MiddlewareRouter>
    ),
  },
  
];

const routes = [...generalRoutes, ...adminRoutes];

export default routes;
