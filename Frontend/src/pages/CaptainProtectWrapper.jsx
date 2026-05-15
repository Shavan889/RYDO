import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();

  const { captain, setCaptain } =
    useContext(CaptainDataContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("captainToken");

    if (!token) {
      navigate("/captain-login");
      return;
    }

    const fetchCaptainProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captain/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setCaptain(response.data.captain);
        }
      } catch (error) {
        console.log(error);

        localStorage.removeItem("token");

        navigate("/captain-login");
      } finally {
        setLoading(false);
      }
    };

    if (!captain) {
      fetchCaptainProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // prevent rendering before data comes
  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;