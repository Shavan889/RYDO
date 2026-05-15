import React from "react";

const RidePopup = (props) => {
  return (
    <div className="text-white px-2">
      {/* Close */}
      <h5
        onClick={() => props.setRidePopupPanel(false)}
        className="text-white/70 text-center text-3xl cursor-pointer mb-2"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      {/* Title */}
      <h3 className="text-xl font-semibold mb-3">New Ride Available</h3>

      {/* Rider Info */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-[#6C5CE7]/20 to-[#A29BFE]/10 border border-[#6C5CE7]/30 mb-3">
        <div className="flex items-center gap-3">
          <img
            className="h-11 w-11 rounded-full object-cover border border-white/20"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
            alt=""
          />
          <h2 className="text-lg font-medium">
            {props.ride?.user.fullname.firstName +
              " " +
              props.ride?.user.fullname.lastName}
          </h2>
        </div>

        <h5 className="text-sm text-white/70">2.2 km away</h5>
      </div>

      {/* Ride Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10">
          <i className="ri-map-pin-user-fill text-[#A29BFE]"></i>
          <div>
            <h3 className="text-sm font-medium">Pickup Location</h3>
            <p className="text-xs text-white/60">{props.ride?.pickup}</p>
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

      {/* Buttons */}
      <div className="mt-4 space-y-2 mb-3">
        {/* Accept (Primary) */}
        <button
          onClick={() => {
            props.setRidePopupPanel(false);
            props.setConfirmRidePopupPanel(true);
            props.confirmRide();
          }}
          className="w-full bg-linear-to-r from-[#6C5CE7] to-[#A29BFE] py-3 rounded-xl font-semibold shadow-md active:scale-95 transition"
        >
          Accept Ride
        </button>

        {/* Ignore (Secondary) */}
        <button
          onClick={() => props.setRidePopupPanel(false)}
          className="w-full bg-white/10 border border-white/10 py-3 rounded-xl font-medium text-white/70 hover:bg-white/20 transition"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopup;
