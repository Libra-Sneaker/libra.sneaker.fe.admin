import jwt_decode from "jwt-decode";
import { Navigate } from "react-router";
import { useAppDispatch } from "../app/hook";
import { SetUserCurrent } from "../app/reducer/common/UserCurrent.reducer";
import { useEffect } from "react";

const checkAuth = () => {
  // const token = Cookies.get("token");
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp && decodedToken.exp > currentTime;
  } catch {
    // Nếu token không hợp lệ, xóa token và thông tin người dùng
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    return false;
  }
};

const MiddlewareRouter = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = checkAuth();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt_decode(token);
        dispatch(SetUserCurrent(decodedToken));
      }
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated || role !== "ADMIN") {
    return <Navigate to="/" replace />; // Chuyển hướng về trang chủ
  }

  // Nếu xác thực thành công và role là ADMIN, render children
  return children;
};

export default MiddlewareRouter;
