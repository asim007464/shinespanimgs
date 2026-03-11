import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FileText, Mail, Phone, MapPin, Briefcase, Calendar, ChevronDown, ChevronUp, User, Loader2 } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminCard, AdminEmptyState } from "../../components/admin/AdminCard";

const STATUS_OPTIONS = ["pending", "approved", "rejected"];

const AdminCleanerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchApplications = async () => {
    try {
      const { data, err } = await supabase
        .from("cleaner_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setApplications(data || []);
    } catch (e) {
      setError(e.message || "Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingStatus(appId);
    try {
      const { error: err } = await supabase.from("cleaner_applications").update({ status: newStatus }).eq("id", appId);
      if (err) throw err;
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
    } catch (e) {
      setError(e.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const DetailRow = ({ label, value }) => (
    <div className="flex flex-wrap gap-2 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm font-medium min-w-[120px]">{label}:</span>
      <span className="text-slate-700 text-sm">{value ?? "-"}</span>
    </div>
  );

  const formatTime = (t) => {
    if (!t || typeof t !== "string") return null;
    const [h, m] = t.split(":").map(Number);
    if (isNaN(h)) return t;
    const h12 = h % 12 || 12;
    const ampm = h < 12 ? "AM" : "PM";
    return `${h12}:${String(m || 0).padStart(2, "0")} ${ampm}`;
  };

  const formatAvailability = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.map((day) => {
      const d = obj[day];
      const slots = [];
      if (d && typeof d === "object") {
        for (let i = 1; i <= 3; i++) {
          const start = d[`s${i}_start`];
          const end = d[`s${i}_end`];
          if (start && end) slots.push(`${formatTime(start)} – ${formatTime(end)}`);
        }
      }
      return { day, enabled: !!(d && d.enabled), slots };
    });
  };

  const formatEligibility = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    const items = [];
    for (const [key, val] of Object.entries(obj)) {
      if (val === null || val === undefined || val === "") continue;
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      items.push({ label, value: typeof val === "object" ? JSON.stringify(val) : String(val) });
    }
    return items.length ? items : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[280px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <AdminPageHeader title="Cleaner Applications" subtitle="Review and manage cleaner job applications" icon={FileText} />
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">{error}</div>
      )}
      <AdminCard>
        {applications.length === 0 ? (
          <AdminEmptyState message="No applications yet." icon={FileText} />
        ) : (
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div key={app.id} className="transition-colors">
                <div
                  onClick={() => toggleExpand(app.id)}
                  className="p-4 sm:p-6 hover:bg-slate-50/50 cursor-pointer flex flex-wrap items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {app.first_name} {app.middle_name ? `${app.middle_name} ` : ""}{app.surname}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                      <span className="flex items-center gap-1"><Mail size={14} />{app.email}</span>
                      <span className="flex items-center gap-1"><Phone size={14} />{app.mobile}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} />{app.postcode}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      <select
                        value={app.status || "pending"}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        disabled={updatingStatus === app.id}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-indigo-300 ${
                          app.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                          app.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {updatingStatus === app.id && <Loader2 size={14} className="animate-spin" />}
                      <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium">
                        {app.experience_level || "-"}
                      </span>
                      {app.experience_types?.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                    {expandedId === app.id ? (
                      <ChevronUp size={20} className="text-slate-500" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-500" />
                    )}
                  </div>
                </div>
                {expandedId === app.id && (
                  <div className="px-4 pb-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/80 rounded-xl p-6 border border-slate-100">
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><User size={16} /> Personal</h4>
                        <div className="bg-white rounded-xl p-4 border border-slate-100">
                          <DetailRow label="First name" value={app.first_name} />
                          <DetailRow label="Middle name" value={app.middle_name} />
                          <DetailRow label="Surname" value={app.surname} />
                          <DetailRow label="Gender" value={app.gender} />
                          <DetailRow label="Email" value={app.email} />
                          <DetailRow label="Mobile" value={app.mobile} />
                          <DetailRow label="Postcode" value={app.postcode} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><Briefcase size={16} /> Experience</h4>
                        <div className="bg-white rounded-xl p-4 border border-slate-100">
                          <DetailRow label="Experience level" value={app.experience_level} />
                          <DetailRow label="Experience types" value={Array.isArray(app.experience_types) ? app.experience_types.join(", ") : app.experience_types} />
                          <DetailRow label="Status" value={app.status} />
                          <DetailRow label="Applied" value={app.created_at ? new Date(app.created_at).toLocaleString() : null} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><FileText size={16} /> Availability & Eligibility</h4>
                        <div className="bg-white rounded-xl p-4 border border-slate-100 space-y-4">
                          <div>
                            <span className="text-slate-500 text-sm font-medium block mb-2">Availability</span>
                            {formatAvailability(app.availability)?.length ? (
                              <div className="space-y-1.5">
                                {formatAvailability(app.availability).map(({ day, enabled, slots }) => (
                                  <div key={day} className="flex items-center justify-between gap-2 text-sm py-1.5 border-b border-slate-50 last:border-0">
                                    <span className="font-medium text-slate-700 min-w-[90px]">{day}</span>
                                    {enabled && slots.length > 0 ? (
                                      <span className="text-slate-600">{slots.join(", ")}</span>
                                    ) : (
                                      <span className="text-slate-400 italic">Not available</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-sm">No availability set</span>
                            )}
                          </div>
                          <div>
                            <span className="text-slate-500 text-sm font-medium block mb-2">Eligibility</span>
                            {formatEligibility(app.eligibility)?.length ? (
                              <div className="space-y-1.5">
                                {formatEligibility(app.eligibility).map(({ label, value }) => (
                                  <div key={label} className="flex gap-2 text-sm py-1.5 border-b border-slate-50 last:border-0">
                                    <span className="text-slate-500 min-w-[100px]">{label}:</span>
                                    <span className="text-slate-700">{value}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-sm">No eligibility info</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default AdminCleanerApplications;
