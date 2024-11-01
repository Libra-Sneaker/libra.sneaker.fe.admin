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
import ProductDetailManagement from "../pages/productManagement/productDetailManagement";
import MaterialManagement from "../pages/materialManagement/MaterialManagement";
import TypeOfShoeManagement from "../pages/typeOfShoeManagement/TypeOfShoeManagement";
import AddProductManagement from "../pages/productManagement/addProduct/AddProductManagement";

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
          <ProductDetailManagement />
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
  
];

const routes = [...generalRoutes, ...adminRoutes];

export default routes;
