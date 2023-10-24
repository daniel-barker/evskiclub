import { Outlet } from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./assets/css/App.css";

const App = () => {
  return (
    <>
      <Header />

      <Outlet />

      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
