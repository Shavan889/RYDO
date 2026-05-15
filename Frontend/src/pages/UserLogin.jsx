import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserSignup from "./UserSignup";
import CaptainLogin from "./CaptainLogin";
import { Mail, Lock, Eye, EyeOff, User, Car } from "lucide-react";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData,
      );

      if (response.status === 200) {
        const data = response.data;

        localStorage.setItem("userToken", data.token);

        setUser(data.user);

        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-[url(/loginBack.jpg)] w-full h-screen bg-cover bg-center absolute p-7 flex flex-col justify-between">
      <div className="-mt-25">
        <img className="w-35" src="/Logo.png" alt="" />
        <div className="-mt-10">
          <form onSubmit={submitHandler}>
            <div>
              <h3 className="text-white/80 text-lg mb-2">What's your email</h3>

              <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#A29BFE]">
                <Mail className="text-white/60 mr-3" size={20} />

                <input
                  className="bg-transparent outline-none text-white placeholder-gray-300 w-full"
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <h3 className="text-white/80 text-lg mb-2">Enter Password</h3>

              <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#A29BFE]">
                <Lock className="text-white/60 mr-3" size={20} />

                <input
                  className="bg-transparent outline-none text-white placeholder-gray-300 w-full"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Eye Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-white/60 ml-3" size={20} />
                  ) : (
                    <Eye className="text-white/60 ml-3" size={20} />
                  )}
                </button>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-[#6C5CE7]/20 text-[#E0D9FF] font-semibold border border-[#6C5CE7]/30 shadow-[0_0_15px_rgba(108,92,231,0.4)] hover:bg-[#6C5CE7]/30 transition-all duration-200 mb-2 mt-6">
              Login
            </button>
          </form>
          <p className="justify-center flex text-white">
            New here?
            <Link to="/signup" className="text-blue-500 ml-2">
              Create new Account
            </Link>
          </p>
        </div>
      </div>
      <div className="">
        <Link
          to="/captain-login"
          className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-[#6C5CE7]/20 text-[#E0D9FF] font-semibold border border-[#6C5CE7]/30 shadow-[0_0_15px_rgba(108,92,231,0.4)] hover:bg-[#6C5CE7]/30 transition-all duration-200 mt-3"
        >
          <Car size={18} className="text-white/80" />
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
