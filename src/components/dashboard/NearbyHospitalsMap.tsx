import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, Navigation, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Location {
  lat: number;
  lng: number;
}

const NearbyHospitalsMap = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Default to GGH Kakinada if location not available
          setUserLocation({ lat: 16.955, lng: 82.2276 });
          setError("Location access denied. Showing default hospital area.");
          setIsLoading(false);
        }
      );
    } else {
      setUserLocation({ lat: 16.955, lng: 82.2276 });
      setError("Geolocation not supported. Showing default hospital area.");
      setIsLoading(false);
    }
  }, []);

  const getMapUrl = () => {
    if (!userLocation) return "";
    return `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=hospitals+near+${userLocation.lat},${userLocation.lng}&zoom=14`;
  };

  const handleGetDirections = () => {
    if (userLocation) {
      window.open(
        `https://www.google.com/maps/search/hospitals+near+me/@${userLocation.lat},${userLocation.lng},14z`,
        "_blank"
      );
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-8 shadow-card flex flex-col items-center justify-center min-h-[300px]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
        <p className="mt-4 text-muted-foreground">Detecting your location...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl shadow-card overflow-hidden"
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hospital className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Nearby Hospitals</h3>
        </div>
        {error && (
          <span className="text-xs text-warning">{error}</span>
        )}
      </div>

      <div className="relative">
        {/* Animated location marker overlay */}
        <motion.div
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 rounded-full bg-primary/90 text-primary-foreground shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Navigation className="h-4 w-4" />
          </motion.div>
          <span className="text-xs font-medium">Your Location</span>
        </motion.div>

        {userLocation ? (
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d30000!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1shospitals!5e0!3m2!1sen!2sin!4v1703084800000!5m2!1sen!2sin`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Nearby Hospitals"
          ></iframe>
        ) : (
          <div className="h-[300px] flex items-center justify-center bg-secondary/50">
            <p className="text-muted-foreground">Unable to load map</p>
          </div>
        )}
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          {userLocation && (
            <span>
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          )}
        </div>
        <Button
          variant="hero"
          size="sm"
          className="gap-2"
          onClick={handleGetDirections}
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </Button>
      </div>
    </motion.div>
  );
};

export default NearbyHospitalsMap;