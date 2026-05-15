import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FinishRide = (props) => {
  const navigate = useNavigate();
  async function endRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        {
          rideId: props.ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        },
      );
      if (response.status === 200) {
        navigate("/Captain-Home");
      }
    } catch (error) {
      console.error("Error ending ride:", error);
    }
  }

  return (
    <div className="text-white w-full">
      <h5
        onClick={() => props.setFinishRidePanel(false)}
        className="text-white/60 text-center text-3xl cursor-pointer mb-2"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-xl font-semibold mb-3">Finish this ride</h3>

      <div className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-[#6C5CE7]/20 to-[#A29BFE]/10 border border-[#6C5CE7]/30 mb-3">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover border border-white/20"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
            alt=""
          />
          <h2 className="text-sm font-medium">
            {props.ride?.user?.fullname?.firstName}{" "}
            {props.ride?.user?.fullname?.lastName}
          </h2>
        </div>

        <h5 className="text-xs text-white/60">2.2 km away</h5>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
          <i className="ri-map-pin-user-fill text-[#A29BFE]"></i>
          <div>
            <h3 className="text-sm font-medium">{props.ride?.pickup}</h3>
            <p className="text-xs text-white/60">Pickup</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
          <i className="ri-map-pin-2-fill text-[#A29BFE]"></i>
          <div>
            <h3 className="text-sm font-medium">{props.ride?.destination}</h3>
            <p className="text-xs text-white/60">Destination</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
          <i className="ri-currency-line text-[#A29BFE]"></i>
          <div>
            <h3 className="text-sm font-medium">₹{props.ride?.fare || "0"}</h3>
            <p className="text-xs text-white/60">Cash</p>
          </div>
        </div>
      </div>

      <button
        onClick={endRide}
        className="mt-5 flex justify-center items-center w-full bg-linear-to-r from-[#6C5CE7] to-[#A29BFE] py-3 rounded-xl font-semibold shadow-lg active:scale-95 transition"
      >
        Finish Ride
      </button>

      <p className="text-center text-xs text-white/50 mt-2 leading-relaxed">
        Complete the ride only after receiving payment from the rider.
      </p>
    </div>
  );
};

export default FinishRide;
