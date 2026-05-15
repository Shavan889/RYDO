import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const location = useLocation();
  const ride = location.state?.ride;

  const [finishRidePanel, setFinishRidePanel] =
    useState(false);

  const FinishRidePanelRef = useRef(null);

  useGSAP(() => {
    gsap.to(FinishRidePanelRef.current, {
      y: finishRidePanel ? "0%" : "100%",
      duration: 0.35,
      ease: finishRidePanel
        ? "power2.out"
        : "power2.in",
    });
  }, [finishRidePanel]);

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden relative">
      {/* MAP */}
      <div className="absolute inset-0 w-full h-full">
      <div className="relative h-[55%] w-full z-10">
         <LiveTracking/>
      </div>
      </div>

      {/* TOP BAR */}
      <div className="relative z-20 -mt-19 flex items-center justify-between px-4 pt-5">
        <img
          className="w-28"
          src="/Logo.png"
          alt=""
        />

        <Link
          to="/captain-home"
          className="h-10 w-10 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white"
        >
          <i className="ri-home-5-line text-lg"></i>
        </Link>
      </div>

      {/* BOTTOM CARD */}
      <div className="mt-auto -bottom-2 relative z-10">
        <div
          onClick={() => setFinishRidePanel(true)}
          className=" border border-white/10 backdrop-blur-2xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.45)]"
        >
          {/* HANDLE */}
          <div className="flex justify-center mb-4">
            <div className="h-1.5 w-14 rounded-full bg-white/20"></div>
          </div>

          {/* HEADER */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-white/50">
                Current Ride
              </p>

              <h2 className="text-2xl font-bold">
                ₹{ride?.fare || 0}
              </h2>
            </div>

            <button className="px-5 py-3 rounded-2xl bg-linear-to-r from-[#6C5CE7] to-[#A29BFE] font-semibold shadow-lg active:scale-95 transition-all duration-300">
              Complete
            </button>
          </div>

          {/* PASSENGER */}
          {ride && (
            <div className="space-y-3">
              {/* USER */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-lg font-semibold">
                  {ride.user?.fullname?.firstName?.[0]}
                </div>

                <div>
                  <p className="text-xs text-white/50">
                    Passenger
                  </p>

                  <h3 className="text-lg font-semibold">
                    {ride.user?.fullname?.firstName}{" "}
                    {ride.user?.fullname?.lastName}
                  </h3>
                </div>
              </div>

              {/* PICKUP */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-10 w-10 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center">
                  <i className="ri-map-pin-user-fill text-[#A29BFE]"></i>
                </div>

                <div>
                  <p className="text-xs text-white/50">
                    Pickup
                  </p>

                  <h4 className="text-sm text-white/80 leading-5">
                    {ride.pickup}
                  </h4>
                </div>
              </div>

              {/* DESTINATION */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="h-10 w-10 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center">
                  <i className="ri-map-pin-2-fill text-[#A29BFE]"></i>
                </div>

                <div>
                  <p className="text-xs text-white/50">
                    Destination
                  </p>

                  <h4 className="text-sm text-white/80 leading-5">
                    {ride.destination}
                  </h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FINISH RIDE PANEL */}
      <div
        ref={FinishRidePanelRef}
        className="fixed bottom-0 left-0 w-full z-50 translate-y-full"
      >
        <div className="border border-white/10 backdrop-blur-2xl p-4 w-full">
          <FinishRide
          ride={ride}
            setFinishRidePanel={setFinishRidePanel}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;