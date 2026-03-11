import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useLocations } from "../../context/LocationsContext";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminCard, AdminEmptyState } from "../../components/admin/AdminCard";

const AdminLocations = () => {
  const { locations, loading, refresh } = useLocations();
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!city?.trim() || !postcode?.trim()) {
      setError("City and postcode are required.");
      return;
    }
    setError("");
    setAdding(true);
    try {
      const { error: err } = await supabase.from("locations").insert({
        city: city.trim(),
        postcode: postcode.trim().toUpperCase(),
      });
      if (err) throw err;
      setCity("");
      setPostcode("");
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to add location");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const { error: err } = await supabase.from("locations").delete().eq("id", id);
      if (err) throw err;
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="w-full">
      <AdminPageHeader title="Service Locations" subtitle="Add UK cities and postcodes. These appear across the website." icon={MapPin} />
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">{error}</div>
      )}
      <div className="mb-6 p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-md">
        <h3 className="font-semibold text-slate-800 mb-4">Add new location</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="City (e.g. London)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <input
            type="text"
            placeholder="Postcode (e.g. SW1A)"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-70 flex items-center justify-center gap-2 transition-colors"
          >
            {adding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Add
          </button>
        </form>
      </div>
      <AdminCard>
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
          </div>
        ) : locations.length === 0 ? (
          <AdminEmptyState message="No locations. Add your first service area above." icon={MapPin} />
        ) : (
          <div className="divide-y divide-slate-100">
            {locations.map((loc) => (
              <div key={loc.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <MapPin size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-800">{loc.city}</span>
                    <span className="text-slate-500 text-sm ml-2">({loc.postcode})</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(loc.id)}
                  disabled={deleting === loc.id}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                  aria-label="Delete"
                >
                  {deleting === loc.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default AdminLocations;
