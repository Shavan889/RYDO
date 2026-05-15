import { useState, useEffect, useCallback, useRef } from "react";

import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

const LiveTracking = ({ pickup, destination, captainLocation }) => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [map, setMap] = useState(null);

  const [directions, setDirections] = useState(null);

  const watchIdRef = useRef(null);

  // ================= MAP LOAD =================

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // ================= USER LIVE LOCATION =================

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");

      setLoading(false);

      return;
    }

    // FUNCTION TO FETCH LOCATION
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const updatedPosition = {
            lat: latitude,
            lng: longitude,
          };

          setCurrentPosition(updatedPosition);

          // SMOOTH MAP MOVE
          if (map) {
            map.panTo(updatedPosition);
          }

          setLoading(false);

          console.log("Updated Location:", updatedPosition);
        },

        (error) => {
          console.log("Location Error:", error.message);

          setError(error.message);

          setLoading(false);
        },

        {
          enableHighAccuracy: true,
          timeout: 50000,
          maximumAge: 0,
        },
      );
    };

    // INITIAL LOCATION
    updateLocation();

    // UPDATE EVERY 5 SECONDS
    const interval = setInterval(() => {
      updateLocation();
    }, 10000);

    // CLEANUP
    return () => clearInterval(interval);
  }, [map]);
  // ================= DIRECTIONS =================

  useEffect(() => {
    if (!pickup || !destination) return;

    if (!window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: pickup,
        destination: destination,
        travelMode: "DRIVING",
      },

      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.log("Directions request failed:", status);
        }
      },
    );
  }, [pickup, destination]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-[#A29BFE]/30 border-t-[#A29BFE] rounded-full animate-spin"></div>

          <p className="text-white/70 mt-4">Fetching Live Location...</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black px-5">
        <div className="bg-white/10 border border-red-500/20 rounded-2xl p-5 text-center backdrop-blur-xl">
          <i className="ri-error-warning-line text-red-400 text-4xl"></i>

          <p className="text-white mt-3">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,

          zoomControl: false,

          streetViewControl: true,

          fullscreenControl: false,

          mapTypeControl: false,

          mapTypeControlOptions: {
            style: 3,
          },

          clickableIcons: true,

          draggable: true,

          scrollwheel: true,

          disableDoubleClickZoom: true,

          keyboardShortcuts: true,

          gestureHandling: "greedy",

          mapTypeId: "roadmap",

          styles: [
            {
              elementType: "geometry",
              stylers: [{ color: "#1d1d1d" }],
            },

            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#1d1d1d" }],
            },

            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#8b8b8b" }],
            },

            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#2d2d2d" }],
            },

            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#000000" }],
            },
          ],
        }}
      >
        {/* USER MARKER */}

        <Marker
          position={currentPosition}
          icon={{
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#6C5CE7" stroke="white" stroke-width="4"/>
                  <circle cx="20" cy="20" r="7" fill="white"/>
                </svg>
              `),

            scaledSize: {
              width: 40,
              height: 40,
            },
          }}
        />

        {/* CAPTAIN MARKER */}

        {captainLocation && (
          <Marker
            position={captainLocation}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                  <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="22" fill="#A29BFE" stroke="white" stroke-width="4"/>
                    <text x="25" y="31" text-anchor="middle" font-size="18" fill="white">🚖</text>
                  </svg>
                `),

              scaledSize: {
                width: 50,
                height: 50,
              },
            }}
          />
        )}

        {/* ROUTE */}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#A29BFE",
                strokeWeight: 5,
              },

              suppressMarkers: false,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveTracking;
