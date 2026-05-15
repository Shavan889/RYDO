import React from "react";

const VehiclePanel = (props) => {
  return (
    <div>
      <h5
        className="text-white text-center relative top-3 text-5xl justify-center"
        onClick={() => {
          props.setVehiclePanelOpen(false);
        }}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-4 text-white">
        Choose a vehicle
      </h3>

      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
          props.setVehicleType("car");
        }}
        className="flex items-center justify-between mb-3 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-200 cursor-pointer"
      >
        <div className="w-[30%]">
          {/* Image */}
          <img className="h-10" src="/car.png" alt="" />
        </div>

        {/* Details */}
        <div className="w-1/2">
          <h4 className="font-medium text-base text-white flex items-center gap-2">
            RydoCar
            <span className="flex items-center text-sm text-white/80">
              <i className="ri-user-3-fill mr-1"></i>4
            </span>
          </h4>

          <h5 className="font-medium text-sm text-white/80">2 mins away</h5>

          <p className="text-xs text-white/60">Comfortable rides</p>
        </div>

        {/* Price */}
        <h2 className="text-lg font-semibold text-[#A29BFE]">₹{props.fare.car}</h2>
      </div>
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
          props.setVehicleType("auto");
        }}
        className="flex items-center justify-between mb-3 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-200 cursor-pointer"
      >
        <div className="w-[30%]">
          {/* Image */}
          <img className="h-14" src="/auto.png" alt="" />
        </div>

        {/* Details */}
        <div className="w-1/2">
          <h4 className="font-medium text-base text-white flex items-center gap-2">
            RydoAuto
            <span className="flex items-center text-sm text-white/80">
              <i className="ri-user-3-fill mr-1"></i>3
            </span>
          </h4>

          <h5 className="font-medium text-sm text-white/80">5 mins away</h5>

          <p className="text-xs text-white/60">easy rides</p>
        </div>

        {/* Price */}
        <h2 className="text-lg font-semibold text-[#A29BFE]">₹{props.fare.auto}</h2>
      </div>
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclePanelOpen(false);
          props.setVehicleType("moto");
        }}
        className="flex items-center justify-between mb-3 p-3 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-200 cursor-pointer"
      >
        <div className="w-[30%]">
          {/* Image */}
          <img className="h-13" src="/moto.png" alt="" />
        </div>

        {/* Details */}
        <div className="w-1/2">
          <h4 className="font-medium text-base text-white flex items-center gap-2">
            RydoBike
            <span className="flex items-center text-sm text-white/80">
              <i className="ri-user-3-fill mr-1"></i>1
            </span>
          </h4>

          <h5 className="font-medium text-sm text-white/80">1 mins away</h5>

          <p className="text-xs text-white/60">Affordable and Fast rides</p>
        </div>

        {/* Price */}
        <h2 className="text-lg font-semibold text-[#A29BFE]">₹{props.fare.moto}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
