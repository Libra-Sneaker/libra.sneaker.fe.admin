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
    return false;
  }
};

const MiddlewareRouter = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = checkAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt_decode(token);
        dispatch(SetUserCurrent(decodedToken));
      }
    }
  }, [isAuthenticated, dispatch]); 


  return children;
};

export default MiddlewareRouter;
