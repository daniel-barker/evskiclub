import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./assets/styles/index.css";
// import "./assets/styles/bootstrap.custom.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import MemberScreen from "./screens/MemberScreen";
import AboutScreen from "./screens/AboutScreen";
import GalleryScreen from "./screens/GalleryScreen";
import ImageUploadScreen from "./screens/Admin/ImageUploadScreen";
import NewsScreen from "./screens/NewsScreen";
import HomeScreen from "./screens/HomeScreen";
import UserListScreen from "./screens/Admin/UserListScreen";
import AdminLogin from "./screens/Admin/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Modal from "react-modal";
import EventListScreen from "./screens/Admin/EventListScreen";
import EventCreateScreen from "./screens/Admin/EventCreateScreen";

Modal.setAppElement("#root");

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="about" element={<AboutScreen />} />
      <Route path="gallery" element={<GalleryScreen />} />
      <Route path="upload" element={<ImageUploadScreen />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="news" element={<NewsScreen />} />
        <Route path="home" element={<MemberScreen />} />
        <Route path="admin" element={<AdminLogin />} />
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminRoute />}>
        <Route path="user/list" element={<UserListScreen />} />
        <Route path="event/list" element={<EventListScreen />} />
        <Route path="event/create" element={<EventCreateScreen />} />
      </Route>
    </Route>
  )
);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
