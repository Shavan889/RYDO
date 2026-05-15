import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Car } from "lucide-react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newCaptain = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate.toUpperCase(),
        capacity: parseInt(vehicleCapacity),
        vehicleType: vehicleType,
      },
    };

  try{
      const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captain/register`,
      newCaptain,
    );

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("captainToken", data.token);
      navigate("/Captain-Home");
    }
  }catch(err){
    console.log(err)
  }
    console.log(newCaptain);

    setEmail("");
    setPassword("");
    setFirstname("");
    setLastname("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/captainSignup.png')] bg-cover bg-center relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-purple-600/30 to-black/80 backdrop-blur-xs" />

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md px-6 py-6 space-y-4">
        <form onSubmit={submitHandler} className="space-y-3">
          {/* Name */}
          <h3 className="text-white/80 text-base">What's your name</h3>

          <div className="grid grid-cols-2 gap-3">
            <input
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#A29BFE]"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#A29BFE]"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          {/* Email */}
          <h3 className="text-white/80 text-base mt-2">What's your email</h3>
          <input
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#A29BFE]"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <h3 className="text-white/80 text-base mt-2">Enter Password</h3>
          <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#A29BFE]">
            <input
              className="bg-transparent text-white w-full outline-none placeholder-gray-300"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Vehicle */}
          <h3 className="text-white/80 text-base mt-2">Vehicle Details</h3>

          <input
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#A29BFE]"
            placeholder="Vehicle Color"
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
          />

          <input
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#A29BFE]"
            placeholder="Vehicle Plate"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#A29BFE]"
              placeholder="Seats"
              type="number"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />

            <select
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#A29BFE]"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option className="text-black">Type</option>
              <option value="car" className="text-black">
                Car
              </option>
              <option value="bike" className="text-black">
                Bike
              </option>
              <option value="auto" className="text-black">
                Auto
              </option>
            </select>
          </div>

          {/* Button */}
          <button className="w-full py-3 mt-2 rounded-xl bg-white/10 border border-white/20 text-white font-semibold backdrop-blur-xl hover:bg-white/20 transition-all">
            Create Account
          </button>

          {/* Login */}
          <p className="text-center text-white/70 text-sm">
            Already have account?
            <Link to="/captain-login" className="text-blue-400 ml-1">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CaptainSignup;
