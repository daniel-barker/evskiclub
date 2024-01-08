import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useCreateNewsMutation,
  useUploadNewsImageMutation,
} from "../../slices/newsApiSlice";

const NewsCreateScreen = () => {
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [createNews, { isLoading: loadingCreate }] = useCreateNewsMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadNewsImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newNews = {
      title,
      post,
      image,
      thumbnail,
    };
    try {
      const result = await createNews(newNews);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("News created successfully");
        navigate("/admin/news/list");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      formData.append("type", "news");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      try {
        const res = await uploadImage(formData).unwrap();
        toast.success(res.message);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return <div>NewsCreateScreen</div>;
};
export default NewsCreateScreen;
