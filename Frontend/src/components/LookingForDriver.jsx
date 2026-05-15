import React from "react";

const LookingForDriver = (props) => {
  return (
    <div className="text-white">
      <h5
        className="text-white/80 text-center relative top-3 text-4xl cursor-pointer"
        onClick={() => {
          props.setVehicleFound(false);
        }}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-4 text-white">
        Looking for a Driver
      </h3>

      <div className="flex flex-col items-center gap-3">
        <img className="h-20" src={`/${props.vehicleType}.png`} alt="" />

        <div className="w-full space-y-2 mb-5">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
            <i className="ri-map-pin-user-fill text-lg text-[#A29BFE]"></i>
            <div>
              <h3 className="text-base font-medium text-white">
                Pickup Location
              </h3>
              <p className="text-sm text-white/60">
                {props.pickup.length > 40
                  ? props.pickup.substring(0, 40) + "..."
                  : props.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
            <i className="ri-map-pin-2-fill text-lg text-[#A29BFE]"></i>
            <div>
              <h3 className="text-base font-medium text-white">Destination</h3>
              <p className="text-sm text-white/60">
                {props.destination.length > 40
                  ? props.destination.substring(0, 40) + "..."
                  : props.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
            <i className="ri-currency-line text-lg text-[#A29BFE]"></i>
            <div className="">
              <h3 className="text-base font-medium text-white">
                ₹{props.fare[props.vehicleType]}
              </h3>
              <p className="text-sm text-white/60">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
