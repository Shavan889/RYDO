import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { SocketDataContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Riding = () => {
  const location = useLocation();
  const { socket } = useContext(SocketDataContext);
  const navigate = useNavigate();
  const [ride, setRide] = useState(() => {
    if (location.state?.ride) {
      return location.state.ride;
    }

    const stored = localStorage.getItem("activeUserRide");

    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("ride-ended", (ride) => {
      console.log("Riding: ride-ended event", ride);

      navigate("/home");
    });

    return () => {
      socket.off("ride-ended");
    };
  }, [socket]);

  useEffect(() => {
    if (ride) {
      localStorage.setItem("activeUserRide", JSON.stringify(ride));
    }
  }, [ride]);

  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      {/* MAP */}
      <div className="absolute inset-0">
        <div className="relative h-[53%] w-full z-10">
          <LiveTracking />
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0"></div>
      </div>

      {/* TOP ACTION */}
      <div className="absolute top-5 right-4 z-30">
        <Link
          to="/home"
          className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-lg"
        >
          <i className="ri-home-5-line text-lg"></i>
        </Link>
      </div>

      {/* LOGO */}
      <div className="absolute -top-12 left-4 z-30">
        <img className="w-28" src="/Logo.png" alt="" />
      </div>

      {/* MAIN CARD */}
      <div className="absolute -bottom-2 left-0 w-full z-20">
        <div className="rounded-[30px] border border-white/10 bg-black/85 backdrop-blur-2xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.45)]">
          {/* HANDLE */}
          <div className="flex justify-center mb-5">
            <div className="h-1.5 w-14 rounded-full bg-white/20"></div>
          </div>

          {/* DRIVER + VEHICLE */}
          <div className="flex items-center justify-between -mb-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-2xl bg-linear-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-xl font-bold shadow-lg">
                {ride?.captain?.fullname?.firstname?.[0] ?? "C"}
              </div>

              <div>
                <p className="text-xs text-white/50">Your Captain</p>

                <h2 className="text-lg font-semibold">
                  {ride?.captain?.fullname?.firstname ?? "Captain"}{" "}
                  {ride?.captain?.fullname?.lastname ?? ""}
                </h2>

                <p className="text-sm text-white/60">
                  {ride?.captain?.vehicle?.vehicleType ?? "Vehicle"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <h3 className="font-bold text-[#A29BFE] tracking-wider">
                {ride?.captain?.vehicle?.plate ?? "--"}
              </h3>

              <p className="text-xs text-white/50 mt-1">Vehicle Number</p>
            </div>
          </div>

          {/* VEHICLE IMAGE */}
          <div className="flex justify-center">
            <img
              className="mb-2 w-30 drop-shadow-[0_10px_25px_rgba(162,155,254,0.35)]"
              src={`/${ride?.captain?.vehicle?.vehicleType ?? "car"}.png`}
              alt=""
            />
          </div>

          {/* RIDE DETAILS */}
          <div className="space-y-3">
            {/* PICKUP */}
            <div className="flex items-start gap-3 p-2 rounded-2xl bg-white/5 border border-white/10">
              <div className="h-11 w-11 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center">
                <i className="ri-map-pin-user-fill text-[#A29BFE] text-lg"></i>
              </div>

              <div>
                <p className="text-xs text-white/50 mb-1">Pickup</p>

                <h3 className="text-sm leading-5 text-white/90">
                  {ride?.pickup ?? "Pickup location"}
                </h3>
              </div>
            </div>

            {/* DESTINATION */}

            {/* FARE */}
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10">
              <div className="h-11 w-11 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center">
                <i className="ri-currency-line text-[#A29BFE] text-lg"></i>
              </div>

              <div>
                <p className="text-xs text-white/50">Payment</p>

                <h3 className="text-lg font-semibold">
                  ₹{ride?.fare ?? "0.00"}
                </h3>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button className="w-full mt-3 py-3 rounded-2xl bg-linear-to-r from-[#6C5CE7] to-[#A29BFE] font-semibold text-lg shadow-[0_10px_30px_rgba(108,92,231,0.45)] active:scale-[0.98] transition-all duration-300">
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Riding;
