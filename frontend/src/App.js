import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Super Admin/Dashboard";
import Customers from "./Pages/Super Admin/Customers";
import Products from "./Pages/Super Admin/Products";
import Form from "./Pages/Super Admin/Form";
import CreateAdmin from "./Pages/Super Admin/CreateAdmin";
import Interest from "./Pages/Super Admin/Interest";
import Report from "./Pages/Super Admin/Report";
import Login from "./Pages/Login";
import PdfView from "./Pages/Super Admin/PdfView";
import DashboardAdmin from "./Pages/Admin/DashboardAdmin";
import CustomersAdmin from "./Pages/Admin/CustomersAdmin";
import ProductsAdmin from "./Pages/Admin/ProductsAdmin";
import InterestAdmin from "./Pages/Admin/InterestAdmin";
import FormAdmin from "./Pages/Admin/FormAdmin";

import ProtectedRoute from "./components/ProtectedRoute";
import Pawn from "./Pages/Super Admin/Pawn";
import Sell from "./Pages/Super Admin/Sell";
import Remove from "./Pages/Super Admin/Remove";
import Item from "./Pages/Super Admin/Item";
import Release from "./Pages/Super Admin/Release";
import "./scroll.css"; // Import external CSS for the button
import Today from "./Pages/Super Admin/Today";

function App() {
  // Scroll to top function
  const scrollToTop = () => {
    // Scroll the sidebar to the top (if it's a scrollable container)
    const sidebar = document.querySelector(".sidebar"); // Assuming your sidebar has the class 'sidebar'
    if (sidebar) {
      sidebar.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    // Scroll the main content to the top (if it's a scrollable container)
    const contentArea = document.querySelector(".content-area"); // Assuming the content area has class 'content-area'
    if (contentArea) {
      contentArea.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    // Scroll the window to the top if needed (optional)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };



  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Customers"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Products"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route path="/Form" element={<Form />} />
          <Route
            path="/item"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Item />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateAdmin"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <CreateAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Interest"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Interest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Pawn"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Pawn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Release"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Release />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sell"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Sell />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Remove"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Remove />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Report"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin"]}>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/View"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin", "admin"]}>
                <PdfView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/today"
            element={
              <ProtectedRoute allowedAccountTypes={["superadmin", "admin"]}>
                <Today />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DashboardAdmin"
            element={
              <ProtectedRoute allowedAccountTypes={["admin"]}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CustomersAdmin"
            element={
              <ProtectedRoute allowedAccountTypes={["admin"]}>
                <CustomersAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProductsAdmin"
            element={
              <ProtectedRoute allowedAccountTypes={["admin"]}>
                <ProductsAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InterestAdmin"
            element={
              <ProtectedRoute allowedAccountTypes={["admin"]}>
                <InterestAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="/FormAdmin" element={<FormAdmin />} />
        </Routes>
      </BrowserRouter>

      {/* Scroll-to-Top Button (Always Visible) */}
      <button className="scroll-to-top-btn" onClick={scrollToTop}>
        ^
      </button>
    </div>
  );
}

export default App;
