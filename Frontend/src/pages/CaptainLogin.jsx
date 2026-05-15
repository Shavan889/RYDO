import React, { useContext, useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/login`,
        captainData,
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("captainToken", data.token);
        setCaptain(data.captain);
        navigate("/Captain-Home");
        setEmail("");
        setPassword("");
        // console.log(data)
      }
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between">
      <div className="">
        <div className="absolute inset-0">
          <img src="/captainLogin.png" className="w-full h-full object-cover" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </div>

        <div className="-mt-30 relative z-10 flex flex-col justify-between h-full px-6 py-8">
          <div>
            <img className="w-30 mt-30" src="/captainLogo.png" alt="" />

            <form onSubmit={submitHandler} className="space-y-4 mt-10">
              {/* Email */}
              <div>
                <h3 className="text-white/80 text-lg mb-2">
                  What's your email
                </h3>

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

              {/* Password */}
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

              {/* Login Button */}
              <button className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold backdrop-blur-md hover:bg-white/20 transition-all duration-200 mt-4">
                Login
              </button>
            </form>

            <p className="flex justify-center text-white/70 mt-4">
              Join a fleet?
              <Link
                to="/captain-signup"
                className="text-white ml-2 font-medium"
              >
                Register as a captain
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="relative top-10 flex w-[85%] m-auto">
        <Link
          to="/login"
          className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-[#6C5CE7]/20 text-[#E0D9FF] font-semibold border border-[#6C5CE7]/30 shadow-[0_0_15px_rgba(108,92,231,0.4)] hover:bg-[#6C5CE7]/30 transition-all duration-200 mt-3"
        >
          <User size={18} className="text-white/80" />
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
