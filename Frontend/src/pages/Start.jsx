import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Start = () => {
  return (
    <div className="bg-cover bg-bottom bg-[url(/banner.png)] h-screen w-full justify-between flex flex-col pt-8">
      <img className="w-35 -mt-30 ml-2" src="/Logo.png" alt="" />
      <div className="py-4 px-4 pb-7">
        <h2 className="text-2xl mb-6 font-bold text-blue-100">
          Get Started with Rydo
        </h2>
        <Link
          to="/login"
          className="w-full py-3 rounded-xl bg-[#6C5CE7]/20 text-[#E0D9FF] font-semibold border border-[#6C5CE7]/30 shadow-[0_0_15px_rgba(108,92,231,0.4)] hover:bg-[#6C5CE7]/30 transition-all duration-200 flex items-center justify-center gap-2 mb-3"
        >
          Continue
          <ArrowRight size={18} className="text-white/80" />
        </Link>
      </div>
    </div>
  );
};

export default Start;
