import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer.jsx";

const App = () => {
  const location = useLocation();
  const hideChrome =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");
  const isCalendar = location.pathname === "/";

  return (
    <>
      {!hideChrome && <Header />}
      <main className={isCalendar ? "main-full" : "app-main"}>
        <div className="app-container">
          <Outlet />
        </div>
      </main>
      {!hideChrome && <Footer />}
      <ToastContainer />
    </>
  );
};

export default App;
