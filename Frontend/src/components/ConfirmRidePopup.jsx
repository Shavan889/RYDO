import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopup = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (otp.length < 4) {
      alert("Enter valid OTP");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride._id,
            otp: otp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        },
      );
      console.log("Start ride response:", response);
      if (response.status === 200) {
        console.log("Start ride response data:", response.data);
        props.setConfirmRidePopupPanel(false); 
        props.setRidePopupPanel(false);
        // Store ride data in localStorage as backup
        localStorage.setItem("activeRide", JSON.stringify(response.data));
        navigate("/captain-riding", {
          state: {
            ride: response.data,
          },
        });
      }
    } catch (error) {
      console.error("Error confirming ride:", error);
      alert("Failed to confirm ride. Please try again.");
    }
  };

  return (
    <div className="text-white px-2">
      <h5
        onClick={() => props.setConfirmRidePopupPanel(false)}
        className="text-white/70 text-center text-3xl cursor-pointer mb-2"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-xl font-semibold mb-3">Confirm this ride</h3>

      <div className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-[#6C5CE7]/20 to-[#A29BFE]/10 border border-[#6C5CE7]/30 mb-3">
        <div className="flex items-center gap-3">
          <img
            className="h-11 w-11 rounded-full object-cover border border-white/20"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
            alt=""
          />
          <h2 className="text-base font-medium">
            {props.ride?.user?.fullname.firstName}{" "}
            {props.ride?.user?.fullname.lastName}
          </h2>
        </div>
        <h5 className="text-sm text-white/70">2.2 km away</h5>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10">
          <i className="ri-map-pin-user-fill text-[#A29BFE]"></i>
          <div>
            <h3 className="text-sm font-medium">Pickup</h3>
            <p className="text-xs text-white/60">
              {props.ride?.pickup}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10">
          <i className="ri-map-pin-2-fill text-[#A29BFE]"></i>
          <div>
            <h3 className="text-sm font-medium">Destination</h3>
            <p className="text-xs text-white/60">{props.ride?.destination}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10">
          <i className="ri-currency-line text-[#A29BFE]"></i>
          <div>
            <h3 className="text-sm font-medium">₹{props.ride?.fare}</h3>
            <p className="text-xs text-white/60">Cash</p>
          </div>
        </div>
      </div>

      <form onSubmit={submitHandler} className="mt-4 space-y-3 mb-3">
        {/* OTP Input */}
        <input
          type="number"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full bg-white/10 border border-white/10 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#A29BFE] text-white placeholder-white/50"
        />

        <button
          type="submit"
          className="w-full bg-linear-to-r from-[#6C5CE7] to-[#A29BFE] py-3 rounded-xl font-semibold shadow-md active:scale-95 transition"
        >
          Start Ride
        </button>

        <button
          type="button"
          onClick={() => props.setConfirmRidePopupPanel(false)}
          className="w-full bg-white/10 border border-white/10 py-3 rounded-xl font-medium text-white/70 hover:bg-white/20 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ConfirmRidePopup;
