import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const LocationsContext = createContext({ locations: [], loading: true });

export const useLocations = () => {
  const context = useContext(LocationsContext);
  if (!context) {
    throw new Error("useLocations must be used within LocationsProvider");
  }
  return context;
};

export const LocationsProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from("locations")
          .select("id, city, postcode, display_order")
          .order("display_order", { ascending: true })
          .order("city", { ascending: true });
        if (!error) setLocations(data || []);
      } catch {
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const checkPostcodeInArea = (postcode) => {
    if (!postcode || !locations.length) return false;
    const clean = String(postcode).toUpperCase().trim().replace(/\s/g, "").slice(0, 6);
    return locations.some((loc) => {
      const locPrefix = String(loc.postcode).toUpperCase().replace(/\s/g, "").slice(0, 6);
      return clean.startsWith(locPrefix) || locPrefix.startsWith(clean.slice(0, 4));
    });
  };

  const value = {
    locations,
    loading,
    refresh: async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("locations")
          .select("id, city, postcode, display_order")
          .order("display_order", { ascending: true })
          .order("city", { ascending: true });
        if (!error) setLocations(data || []);
      } finally {
        setLoading(false);
      }
    },
    checkPostcodeInArea,
  };

  return (
    <LocationsContext.Provider value={value}>
      {children}
    </LocationsContext.Provider>
  );
};
