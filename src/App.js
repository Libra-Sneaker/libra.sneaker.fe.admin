import "./App.css";
import { useAppSelector } from "./app/hook";
import { GetLoading } from "./app/reducer/common/LoadingSlice.reducer";
import { ToastContainer } from "react-toastify";
import  LoadingHamster  from "./component/loading/loading-hamster";
import { AppConfig } from "./AppConfig";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import routes from "./router/router";

function App() {
  const isLoading = useAppSelector(GetLoading);

  return (
    <div className="App scroll-smooth md:scroll-auto">
      <ToastContainer />
      {isLoading && <LoadingHamster />}
      <BrowserRouter basename={AppConfig.routerBase}>
        <Suspense>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
