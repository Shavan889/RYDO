import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.log("Logout error:", err.response?.data || err.message);
      }

      localStorage.removeItem("token");
      navigate("/login");
    };

    logout();
  }, []);

  return <div className="text-white text-center mt-10">Logging out...</div>;
};

export default UserLogout;
