import React, { useRef, useState, useEffect, useContext } from "react";

import { Link } from "react-router-dom";
import CaptainDetailes from "../components/CaptainDetailes";
import RidePopup from "../components/RidePopup";
import ConfirmRidePopup from "../components/ConfirmRidePopup";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { SocketDataContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

import axios from "axios";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);

  const [ConfirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);

  const ConfirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketDataContext);

  const { captain } = useContext(CaptainDataContext);

  // JOIN ROOM + LOCATION UPDATE
  useEffect(() => {
    console.log("socket id for capain home:", socket?.id);

    if (!socket || !captain?._id) return;

    console.log("CAPTAIN JOIN ROOM:", captain._id);

    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log("Updating location:", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    updateLocation();

    const locationInterval = setInterval(updateLocation, 10000);

    return () => {
      clearInterval(locationInterval);
    };
  }, [socket, captain]);

  // NEW RIDE LISTENER
  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log("NEW RIDE RECEIVED:", data);

      setRide(data);

      setRidePopupPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  // CONFIRM RIDE
  async function confirmRide() {
    try {
      console.log("CAPTAIN TOKEN:", localStorage.getItem("captainToken"));

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        },
      );

      console.log("RIDE CONFIRMED:", response.data);

      setRide(response.data);

      setRidePopupPanel(false);

      setConfirmRidePopupPanel(true);
    } catch (err) {
      console.log(err);
      console.log(err.response?.data || err);
    }
  }

  // RIDE POPUP ANIMATION
  useGSAP(() => {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        y: "0%",
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        y: "100%",
        duration: 0.35,
        ease: "power2.in",
      });
    }
  }, [ridePopupPanel]);

  // CONFIRM POPUP ANIMATION
  useGSAP(() => {
    if (ConfirmRidePopupPanel) {
      gsap.to(ConfirmRidePopupPanelRef.current, {
        y: "0%",
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(ConfirmRidePopupPanelRef.current, {
        y: "100%",
        duration: 0.35,
        ease: "power2.in",
      });
    }
  }, [ConfirmRidePopupPanel]);

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      <div>
        <img className="w-25 -mt-15 ml-3 absolute z-6" src="/Logo.png" alt="" />

        <Link
          to="/home"
          className="fixed right-2 top-2 h-10 w-10 bg-white z-5 flex items-center justify-center rounded-full text-black"
        >
          <i className="text-lg font-bold ri-logout-box-fill"></i>
        </Link>
      </div>

      <div className="h-full">
        <img
          className="h-full w-full object-cover"
          src="/CaptainHomeBanner.png"
          alt=""
        />
      </div>

      <div className="flex-1 px-4 pt-4 pb-5 flex flex-col absolute w-full bottom-0 justify-between backdrop-blur-xl border-t border-white/10">
        <CaptainDetailes />
      </div>

      {/* RIDE POPUP */}
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full bottom-0 z-10 px-4 translate-y-full pb-2 backdrop-blur-xl bg-black/70 border-t border-white/10"
      >
        <RidePopup
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      {/* CONFIRM POPUP */}
      <div
        ref={ConfirmRidePopupPanelRef}
        className="fixed w-full bottom-0 translate-y-full z-10 px-4 pb-2 backdrop-blur-xl bg-black/70 border-t border-white/10"
      >
        <ConfirmRidePopup
        ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
