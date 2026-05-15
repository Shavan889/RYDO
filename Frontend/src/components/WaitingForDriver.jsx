import React from "react";

const WaitingForDriver = (props) => {
  return (
    <div className="text-white">
      <h5
        className="text-white/80 text-center relative top-3 text-4xl cursor-pointer"
        onClick={() => {
          props.setWaitingForDriver(false);
        }}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <div className="flex items-center justify-between">
        <img className="w-35" src={`/${props.captain?.vehicle?.vehicleType}.png`} alt="" />
        <div className="text-right mb-5">
          <h2 className="text-lg font-medium capitalize">
            {props.captain?.fullname?.firstname} {props.captain?.fullname?.lastname || "Driver Name"}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {props.captain?.vehicle?.plate || "N/A"}
          </h4>
          <p className="text-sm text-gray-600">
            {props.captain?.vehicle?.vehicleType || "Vehicle"}
          </p>
          <h1 className="text-lg font-semibold -mt-1 -mb-1">OTP - {props.ride?.otp || "N/A"}</h1>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="w-full space-y-2 mb-5">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
            <i className="ri-map-pin-user-fill text-lg text-[#A29BFE]"></i>
            <div>
              <h3 className="text-base font-medium text-white">Pickup</h3>
              <p className="text-sm text-white/60">
                {props.ride?.pickup?.length > 40
                  ? props.ride?.pickup?.substring(0, 40) + "..."
                  : props.ride?.pickup || "Pickup Location"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
            <i className="ri-map-pin-2-fill text-lg text-[#A29BFE]"></i>
            <div>
              <h3 className="text-base font-medium text-white">Destination</h3>
              <p className="text-sm text-white/60">
                {props.ride?.destination?.length > 40
                  ? props.ride?.destination?.substring(0, 40) + "..."
                  : props.ride?.destination || "Destination Location"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
            <i className="ri-currency-line text-lg text-[#A29BFE]"></i>
            <div className="">
              <h3 className="text-base font-medium text-white">
                ₹{props.ride?.fare || "0"}
              </h3>
              <p className="text-sm text-white/60">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
