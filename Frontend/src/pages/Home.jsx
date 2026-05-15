import React, { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { SocketDataContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

// const API_BASE_URL =
//   import.meta.env.VITE_BASE_URL || "http://localhost:4000";

const panelClass =
  "fixed w-full bottom-0 z-10 px-4 pb-2 backdrop-blur-xl bg-black/70 border-t border-white/10";

const Home = () => {
  // ================= STATES =================
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState("");
  const [loading, setLoading] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanelOpen, setConfirmRidePanelOpen] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [ride, setRide] = useState(null);
  const [captain, setCaptain] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);

  // ================= REFS =================
  const panelRef = useRef(null);
  const downRef = useRef(null);

  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const debounceRef = useRef(null);
  const [roomJoined, setRoomJoined] = useState(false);

  const { socket, isConnected } = useContext(SocketDataContext);
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  socket.on("ride-started", (ride) => {
    setWaitingForDriver(false);
    console.log("Home: ride-started event", ride);
    localStorage.setItem("activeUserRide", JSON.stringify(ride));
    navigate("/riding", { state: { ride } });
  });

  // DEBUG: Log user changes
  useEffect(() => {
    console.log("[STATE UPDATE] User context updated:", user);
  }, [user]);

  // USER JOIN ROOM
  useEffect(() => {
    console.log(
      "[ROOM JOIN] Effect running - socket:",
      !!socket,
      "user._id:",
      user?._id,
      "full user:",
      user,
    );

    if (!socket || !user?._id) {
      setRoomJoined(false);
      console.log("[ROOM JOIN] Conditions not met, skipping");
      return;
    }

    console.log("[ROOM JOIN] Emitting join event for user:", user._id);

    socket.emit("join", {
      userId: user._id,
      userType: "user",
    });

    // console.log("[ROOM JOIN] Join event emitted, setting roomJoined to true");
    setRoomJoined(true);

    return () => {
      console.log("[ROOM JOIN] Cleanup - setting roomJoined to false");
      setRoomJoined(false);
    };
  }, [socket, user]);

  // RIDE CONFIRMED LISTENER - Set up AFTER room join is confirmed
  useEffect(() => {
    console.log(
      "[LISTENER SETUP] Checking conditions - socket:",
      !!socket,
      "roomJoined:",
      roomJoined,
      "user._id:",
      user?._id,
    );

    if (!socket || !roomJoined) {
      console.log("[LISTENER SETUP] Skipping - socket or roomJoined not ready");
      return;
    }

    // console.log(
    //   "[LISTENER SETUP] Setting up ride-confirmed listener for user:",
    //   user?._id,
    // );

    const handleRideConfirmed = (data) => {
      console.log("[RIDE CONFIRMED] EVENT RECEIVED:", data);
      console.log("[RIDE CONFIRMED] Captain data:", data.captain);

      try {
        setRide(data);
        setCaptain(data.captain);
        // console.log("[RIDE CONFIRMED] Ride and captain data set successfully");

        setVehicleFound(false);
        // console.log("[RIDE CONFIRMED] setVehicleFound(false) called");

        setWaitingForDriver(true);
        // console.log("[RIDE CONFIRMED] setWaitingForDriver(true) called");
      } catch (err) {
        console.error("[RIDE CONFIRMED] Error in handler:", err);
      }
    };

    // Remove any existing listeners first
    socket.off("ride-confirmed");
    console.log("[LISTENER SETUP] Removed old listeners");

    // Set up new listener
    socket.on("ride-confirmed", handleRideConfirmed);
    console.log("[LISTENER SETUP] New listener registered");

    return () => {
      console.log("[LISTENER CLEANUP] Removing ride-confirmed listener");
      socket.off("ride-confirmed", handleRideConfirmed);
    };
  }, [socket, roomJoined, user]);

  // DEBUG: Log waitingForDriver state changes
  useEffect(() => {
    console.log(
      "[STATE UPDATE] waitingForDriver changed to:",
      waitingForDriver,
    );
  }, [waitingForDriver]);

  // DEBUG: Log vehicleFound state changes
  useEffect(() => {
    console.log("[STATE UPDATE] vehicleFound changed to:", vehicleFound);
  }, [vehicleFound]);
  // ================= HELPERS =================

  const animateBottomPanel = (ref, open) => {
    gsap.to(ref.current, {
      y: open ? "0%" : "100%",
      duration: 0.35,
      ease: open ? "power2.out" : "power2.in",
    });
  };

  const handleInputChange = (field, value) => {
    if (field === "pickup") {
      setPickup(value);
    } else {
      setDestination(value);
    }

    setActiveField(field);
    setPanelOpen(true);
  };

  const handleSuggestionSelect = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion);
      setActiveField("destination");
    } else {
      setDestination(suggestion);
    }

    setSuggestions([]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // validation
    if (!pickup || !destination) return;

    // close location panel
    setPanelOpen(false);

    // open vehicle panel
    setVehiclePanelOpen(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: {
            pickup,
            destination,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      setFare(response.data);
    } catch (err) {
      console.error("Error fetching fare:", err);
    }
    // console.log(response.data);
  };
  // ================= FETCH SUGGESTIONS =================

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const inputValue = activeField === "pickup" ? pickup : destination;

    if (inputValue.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestion`,
          {
            params: {
              input: inputValue,
            },
          },
        );

        const data = Array.isArray(response.data)
          ? response.data.map(
              (item) => item.description ?? item.main_text ?? "",
            )
          : [];

        setSuggestions(data);
      } catch (error) {
        console.error("Suggestion Error:", error);

        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [pickup, destination, activeField]);

  async function createRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      setConfirmRidePanelOpen(false);

      setVehicleFound(true);
      // console.log(response.data);
    } catch (err) {
      console.error("Error creating ride:", err);
    }
  }

  // ================= SEARCH PANEL =================

  useGSAP(() => {
    const tl = gsap.timeline();

    if (panelOpen) {
      tl.to(panelRef.current, {
        height: "70%",
        duration: 0.3,
        ease: "power2.out",
      }).to(
        downRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
        },
        "<",
      );
    } else {
      tl.to(panelRef.current, {
        height: "0%",
        duration: 0.3,
        ease: "power2.in",
      }).to(
        downRef.current,
        {
          autoAlpha: 0,
          y: 50,
          duration: 0.3,
        },
        "<",
      );
    }
  }, [panelOpen]);

  // ================= OTHER PANELS =================

  useGSAP(() => {
    console.log("[GSAP] Animating vehiclePanelRef - open:", vehiclePanelOpen);
    animateBottomPanel(vehiclePanelRef, vehiclePanelOpen);
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    console.log(
      "[GSAP] Animating confirmRidePanelRef - open:",
      confirmRidePanelOpen,
    );
    animateBottomPanel(confirmRidePanelRef, confirmRidePanelOpen);
  }, [confirmRidePanelOpen]);

  useGSAP(() => {
    console.log("[GSAP] Animating vehicleFoundRef - open:", vehicleFound);
    animateBottomPanel(vehicleFoundRef, vehicleFound);
  }, [vehicleFound]);

  useGSAP(() => {
    console.log(
      "[GSAP] Animating waitingForDriverRef - open:",
      waitingForDriver,
    );
    animateBottomPanel(waitingForDriverRef, waitingForDriver);
  }, [waitingForDriver]);

  // ================= SUBMIT =================

  return (
    <div className="h-screen relative overflow-hidden">
      {/* MAP */}
      <div className="h-full w-full absolute z-10 inset-0 bg-linear-to-b from-[#6C5CE7]/20 to-black/70">
        <div className="h-[65%]">
          <LiveTracking />
        </div>
      </div>

      {/* OVERLAY */}
      {/* <div className="absolute inset-0 bg-linear-to-b to-black/70" /> */}

      {/* LOGO */}
      <img
        className="w-28 absolute -top-18 left-4 z-10"
        src="/Logo.png"
        alt=""
      />

      {/* MAIN CONTENT */}
      <div className="absolute flex flex-col justify-end h-screen w-full top-0">
        {/* SEARCH BOX */}
        <div className="h-[37%] p-5 backdrop-blur-xl bg-linear-to-b from-[#6C5CE7]/20 to-black/70 relative z-10">
          {/* DOWN ICON */}
          <h5
            ref={downRef}
            onClick={() => setPanelOpen(false)}
            className="absolute top-4 right-5 text-3xl cursor-pointer text-white"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>

          <h4 className="text-2xl text-white font-semibold mb-3">
            Find a trip
          </h4>

          <form onSubmit={submitHandler} className="space-y-3">
            {/* LINE */}
            <div className="absolute z-5 h-16 w-1 bg-white top-23 left-9 rounded-full"></div>

            {/* PICKUP */}
            <input
              type="text"
              placeholder="Add a pick-up location"
              value={pickup}
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              onChange={(e) => handleInputChange("pickup", e.target.value)}
              className="bg-black/50 border border-white/10 px-10 py-3 text-white placeholder-gray-300 rounded-xl w-full backdrop-blur-md outline-none focus:ring-2 focus:ring-[#A29BFE]"
            />

            {/* DESTINATION */}
            <input
              type="text"
              placeholder="Enter your destination"
              value={destination}
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              onChange={(e) => handleInputChange("destination", e.target.value)}
              className="bg-black/50 border border-white/10 px-10 py-3 text-white placeholder-gray-300 rounded-xl w-full backdrop-blur-md outline-none focus:ring-2 focus:ring-[#A29BFE]"
            />

            {/* BUTTON */}
            <button
              className="
            w-full
            py-2
            px-6
            rounded-2xl
            bg-white/10
            backdrop-blur-xl
            border
            border-white/15
            text-white
            font-medium
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            hover:bg-white/15
            active:scale-95
            transition-all
            duration-300
            flex
            items-center
            justify-center
            gap-2
          "
            >
              <i className="ri-route-line text-lg text-[#A29BFE]"></i>
              Find Trip
            </button>
          </form>
        </div>

        {/* LOCATION PANEL */}
        <div
          ref={panelRef}
          className="h-0 overflow-scroll backdrop-blur-xl bg-black/60 z-10"
        >
          <LocationSearchPanel
            suggestions={suggestions}
            loading={loading}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </div>
      </div>

      {/* VEHICLE PANEL */}
      <div ref={vehiclePanelRef} className={panelClass}>
        <VehiclePanel
          setVehiclePanelOpen={setVehiclePanelOpen}
          setConfirmRidePanel={setConfirmRidePanelOpen}
          fare={fare}
          setVehicleType={setVehicleType}
        />
      </div>

      {/* CONFIRM RIDE PANEL */}
      <div ref={confirmRidePanelRef} className={panelClass}>
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanelOpen}
          setVehicleFound={setVehicleFound}
          fare={fare}
          createRide={createRide}
          vehicleType={vehicleType}
          pickup={pickup}
          destination={destination}
        />
      </div>

      {/* LOOKING FOR DRIVER */}
      <div ref={vehicleFoundRef} className={panelClass}>
        <LookingForDriver
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          fare={fare}
          pickup={pickup}
          destination={destination}
          vehicleType={vehicleType}
        />
      </div>

      {/* WAITING FOR DRIVER */}
      <div ref={waitingForDriverRef} className={panelClass}>
        <WaitingForDriver
          setWaitingForDriver={setWaitingForDriver}
          ride={ride}
          captain={captain}
        />
      </div>
    </div>
  );
};

export default Home;
