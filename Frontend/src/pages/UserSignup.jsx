import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Car } from "lucide-react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userData, setUserData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password,
      fullname: {
        firstName: firstname,
        lastName: lastname,
      },
    };

    try {
      const response = await axios.post(
       `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser,
      );
      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/home");
      }
      setPassword("");
      setEmail("");
      setFirstname("");
      setLastname("");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  return (
    <div className="bg-[url(/userSignup.png)] w-full h-screen bg-cover bg-center absolute p-7 flex flex-col justify-between">
      <div className="-mt-25">
        <img className="w-35" src="/Logo.png" alt="" />
        <div className="-mt-13">
          <form onSubmit={submitHandler}>
            <div>
              <h3 className="text-white/80 text-lg mb-2">What's your name</h3>

              <div className="flex flex-row gap-3">
                {/* First Name */}
                <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#A29BFE] w-2/3">
                  <User className="text-white/60 mr-3" size={20} />

                  <input
                    className="bg-transparent outline-none text-white placeholder-gray-300 w-full"
                    type="text"
                    required
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => {
                      setFirstname(e.target.value);
                    }}
                  />
                </div>

                {/* Last Name */}
                <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#A29BFE] w-2/3">
                  <User className="text-white/60 mr-3" size={20} />

                  <input
                    className="bg-transparent outline-none text-white placeholder-gray-300 w-full"
                    type="text"
                    required
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => {
                      setLastname(e.target.value);
                    }}
                  />
                </div>
              </div>

              <h3 className="text-white/80 text-lg mb-2 mt-5">
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <h3 className="text-white/80 text-lg mb-2 mt-5">
                Enter Password
              </h3>

              <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#A29BFE]">
                <Lock className="text-white/60 mr-3" size={20} />

                <input
                  className="bg-transparent outline-none text-white placeholder-gray-300 w-full"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
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
            <button className="w-full py-3 rounded-xl bg-[#6C5CE7]/20 text-[#E0D9FF] font-semibold border border-[#6C5CE7]/30 shadow-[0_0_15px_rgba(108,92,231,0.4)] hover:bg-[#6C5CE7]/30 transition-all duration-200 mb-2 mt-5">
              Create Account
            </button>
          </form>
          <p className="justify-center flex text-white">
            Already a user?
            <Link to="/login" className="text-blue-500 ml-2">
              Login Here
            </Link>
          </p>
        </div>
      </div>
      <div className="text-xs text-white leading-tight">
        <p>
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms and Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
