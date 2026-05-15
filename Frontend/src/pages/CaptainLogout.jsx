import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captain/logout`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Backend logout success");
        }

      } catch (err) {
        console.log("Logout API failed:", err.response?.data || err.message);
      }

      localStorage.removeItem("token");
      navigate("/captain-login");
    };

    logout();
  }, []);

  return <div className="text-white text-center mt-10">Logging out...</div>;
};

export default CaptainLogout;