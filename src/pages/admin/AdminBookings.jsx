import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { MapPin, ChevronDown, ChevronUp, Home, Clock, CalendarCheck, Loader2 } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminCard, AdminEmptyState } from "../../components/admin/AdminCard";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchBookings = async () => {
    try {
      const { data, err } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setBookings(data || []);
    } catch (e) {
      setError(e.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingStatus(bookingId);
    try {
      const { error: err } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId);
      if (err) throw err;
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
    } catch (e) {
      setError(e.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const DetailRow = ({ label, value }) => (
    <div className="flex flex-wrap gap-2 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm font-medium min-w-[140px]">{label}:</span>
      <span className="text-slate-700 text-sm">{value ?? "-"}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[280px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <AdminPageHeader title="Bookings" subtitle="View and manage all booking requests" icon={CalendarCheck} />
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">{error}</div>
      )}
      <AdminCard>
        {bookings.length === 0 ? (
          <AdminEmptyState message="No bookings yet." icon={CalendarCheck} />
        ) : (
          <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 w-8"></th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700">Services</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700">Postcode</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700">Contact</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <React.Fragment key={b.id}>
                    <tr
                      onClick={() => toggleExpand(b.id)}
                      className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        {expandedId === b.id ? (
                          <ChevronUp size={18} className="text-slate-500" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-500" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800">{b.first_name} {b.surname}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {b.service_types?.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">{s}</span>
                          ))}
                          {(!b.service_types || b.service_types.length === 0) && <span className="text-slate-400">-</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{b.postcode || "-"}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">
                        {b.first_clean_date ? new Date(b.first_clean_date).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status || "pending"}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          disabled={updatingStatus === b.id}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer focus:ring-2 focus:ring-indigo-300 ${
                            b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                            b.status === "completed" ? "bg-slate-100 text-slate-700" :
                            b.status === "cancelled" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updatingStatus === b.id && <Loader2 size={12} className="animate-spin inline ml-1" />}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">
                        <div>{b.email || "-"}</div>
                        <div className="text-xs">{b.phone || ""}</div>
                      </td>
                    </tr>
                    {expandedId === b.id && (
                      <tr>
                        <td colSpan={7} className="bg-slate-50/80 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><Home size={16} /> Property & Service</h4>
                              <div className="bg-white rounded-xl p-4 border border-slate-100">
                                <DetailRow label="Property type" value={b.property_type} />
                                <DetailRow label="Bedrooms" value={b.bedrooms} />
                                <DetailRow label="Bathrooms" value={b.bathrooms} />
                                <DetailRow label="Duration (hours)" value={b.duration_hours} />
                                <DetailRow label="Frequency" value={b.frequency} />
                                <DetailRow label="Products" value={b.products} />
                                <DetailRow label="Extras" value={Array.isArray(b.extras) ? b.extras.join(", ") : b.extras} />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><Clock size={16} /> Schedule</h4>
                              <div className="bg-white rounded-xl p-4 border border-slate-100">
                                <DetailRow label="First clean date" value={b.first_clean_date ? new Date(b.first_clean_date).toLocaleDateString() : null} />
                                <DetailRow label="Arrival time" value={b.arrival_time} />
                                <DetailRow label="Access method" value={b.access_method} />
                                <DetailRow label="Created" value={b.created_at ? new Date(b.created_at).toLocaleString() : null} />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><MapPin size={16} /> Address & Contact</h4>
                              <div className="bg-white rounded-xl p-4 border border-slate-100">
                                <DetailRow label="Address line 1" value={b.address_line1} />
                                <DetailRow label="Address line 2" value={b.address_line2} />
                                <DetailRow label="City" value={b.city} />
                                <DetailRow label="Postcode" value={b.address_postcode || b.postcode} />
                                <DetailRow label="Phone" value={b.phone} />
                                <DetailRow label="Email" value={b.email} />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {bookings.map((b) => (
              <div key={b.id} className="p-4">
                <div
                  onClick={() => toggleExpand(b.id)}
                  className="cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-800">{b.first_name} {b.surname}</span>
                    {expandedId === b.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {b.service_types?.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">{s}</span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <select
                      value={b.status || "pending"}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      disabled={updatingStatus === b.id}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-medium px-2 py-1 rounded"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {updatingStatus === b.id && <Loader2 size={12} className="animate-spin" />}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{b.email}</p>
                </div>
                {expandedId === b.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-sm">
                    <div><span className="text-slate-500">Property:</span> {b.property_type || "-"} · {b.bedrooms} bed · {b.bathrooms} bath</div>
                    <div><span className="text-slate-500">Date:</span> {b.first_clean_date ? new Date(b.first_clean_date).toLocaleDateString() : "-"} · {b.arrival_time || "-"}</div>
                    <div><span className="text-slate-500">Address:</span> {b.address_line1 || "-"} {b.city || ""} {b.address_postcode || b.postcode || ""}</div>
                    <div><span className="text-slate-500">Phone:</span> {b.phone || "-"}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          </>
        )}
      </AdminCard>
    </div>
  );
};

export default AdminBookings;
