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
import Modal from "react-modal";
import reportWebVitals from "./reportWebVitals";
import MemberScreen from "./screens/MemberScreen";
import AboutScreen from "./screens/AboutScreen";
import GalleryScreen from "./screens/GalleryScreen";
import ImageUploadScreen from "./screens/Admin/ImageUploadScreen";
import HomeScreen from "./screens/HomeScreen";
import UserListScreen from "./screens/Admin/UserListScreen";
import AdminLogin from "./screens/Admin/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import EventListScreen from "./screens/Admin/EventListScreen";
import EventCreateScreen from "./screens/Admin/EventCreateScreen";
import EventDetailScreen from "./screens/EventDetailScreen";
import EventEditScreen from "./screens/Admin/EventEditScreen";
import NewsScreen from "./screens/NewsScreen";
import NewsCreateScreen from "./screens/Admin/NewsCreateScreen";
import NewsListScreen from "./screens/Admin/NewsListScreen";
import NewsEditScreen from "./screens/Admin/NewsEditScreen";

Modal.setAppElement("#root");

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<HomeScreen />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="news" element={<NewsScreen />} />
        <Route path="home" element={<MemberScreen />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="about" element={<AboutScreen />} />
        <Route path="gallery" element={<GalleryScreen />} />
        <Route path="upload" element={<ImageUploadScreen />} />
        <Route path="event/:id" element={<EventDetailScreen />} />
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminRoute />}>
        <Route path="user/list" element={<UserListScreen />} />
        <Route path="event/list" element={<EventListScreen />} />
        <Route path="event/create" element={<EventCreateScreen />} />
        <Route path="event/:id/edit" element={<EventEditScreen />} />
        <Route path="news/list" element={<NewsListScreen />} />
        <Route path="news/create" element={<NewsCreateScreen />} />
        <Route path="news/:id/edit" element={<NewsEditScreen />} />
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
