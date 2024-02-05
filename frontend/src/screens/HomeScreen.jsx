import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  return <div></div>;
};
export default HomeScreen;
