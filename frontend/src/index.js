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
import App from "./App";
import Modal from "react-modal";
import reportWebVitals from "./reportWebVitals";
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import MemberScreen from "./screens/MemberScreen";
import AboutScreen from "./screens/AboutScreen";
import HomeScreen from "./screens/HomeScreen";
import UserListScreen from "./screens/Admin/UserListScreen";
import UserEditScreen from "./screens/Admin/UserEditScreen";
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
import PendingApprovalScreen from "./screens/PendingApprovalScreen";
import ImageUploadScreen from "./screens/Admin/ImageUploadScreen";
import ImageListScreen from "./screens/Admin/ImageListScreen";
import ImageEditScreen from "./screens/Admin/ImageEditScreen";
import GalleryScreen from "./screens/GalleryScreen";
import GalleryByTagScreen from "./screens/GalleryByTagScreen";
import MemberListScreen from "./screens/Admin/MemberListScreen";

Modal.setAppElement("#root");

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="register" element={<RegistrationScreen />} />
      <Route path="login" element={<LoginScreen />} />
      <Route path="pending-approval" element={<PendingApprovalScreen />} />
      <Route path="forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="reset-password/:token" element={<ResetPasswordScreen />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="news" element={<NewsScreen />} />
        <Route path="home" element={<MemberScreen />} />
        <Route path="about" element={<AboutScreen />} />
        <Route path="gallery" element={<GalleryScreen />} />
        <Route path="gallery/:tag" element={<GalleryByTagScreen />} />
        <Route path="event/:id" element={<EventDetailScreen />} />
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminRoute />}>
        <Route path="user/list" element={<UserListScreen />} />
        <Route path="user/:id/edit" element={<UserEditScreen />} />
        <Route path="event/list" element={<EventListScreen />} />
        <Route path="event/create" element={<EventCreateScreen />} />
        <Route path="event/:id/edit" element={<EventEditScreen />} />
        <Route path="news/list" element={<NewsListScreen />} />
        <Route path="news/create" element={<NewsCreateScreen />} />
        <Route path="news/:id/edit" element={<NewsEditScreen />} />
        <Route path="images/upload" element={<ImageUploadScreen />} />
        <Route path="images/list" element={<ImageListScreen />} />
        <Route path="images/:id/edit" element={<ImageEditScreen />} />
        <Route path="members/list" element={<MemberListScreen />} />
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
