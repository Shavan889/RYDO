import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetailes = () => {
  const { captain } = useContext(CaptainDataContext);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover border border-white/20"
            src="https://img.freepik.com/free-photo/lifestyle-beauty-fashion-people-emotions-concept-young-asian-female-office-manager-ceo-with-pleased-expression-standing-white-background-smiling-with-arms-crossed-chest_1258-59329.jpg"
            alt=""
          />
          <div>
            <h4 className="text-base font-semibold capitalize">
              {captain?.fullname.firstname} {captain?.fullname.lastname}
            </h4>
            <p className="text-xs text-white/50">Captain</p>
          </div>
        </div>

        <div className="text-right">
          <h4 className="text-lg font-semibold text-[#8B7CF6]">₹55</h4>
          <p className="text-xs text-white/50">Today</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <i className="ri-timer-2-line text-xl text-[#8B7CF6]"></i>
          <h5 className="text-base font-semibold mt-1">10.2</h5>
          <p className="text-xs text-white/50">Hours</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <i className="ri-road-map-line text-xl text-[#8B7CF6]"></i>
          <h5 className="text-base font-semibold mt-1">18</h5>
          <p className="text-xs text-white/50">Trips</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <i className="ri-star-smile-line text-xl text-[#8B7CF6]"></i>
          <h5 className="text-base font-semibold mt-1">4.9</h5>
          <p className="text-xs text-white/50">Rating</p>
        </div>
      </div>

      <button className="mt-4 w-full py-3 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#A29BFE] font-semibold tracking-wide shadow-lg active:scale-95 transition">
        Go Online
      </button>
    </div>
  );
};

export default CaptainDetailes;
