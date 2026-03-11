import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../auth/AuthContext";
import { Shield, Crown, User, Sparkles, Loader2, Users, ChevronDown, ChevronUp, Mail, MapPin } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminCard, AdminEmptyState } from "../../components/admin/AdminCard";

const RoleBadge = ({ role }) => {
  const config = {
    super_admin: {
      icon: Crown,
      className: "bg-amber-100 text-amber-800 border-amber-200",
    },
    admin: {
      icon: Shield,
      className: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    cleaner: {
      icon: Sparkles,
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
    client: {
      icon: User,
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
  };
  const r = role || "client";
  const { icon: Icon, className } = config[r] || config.client;
  const labels = { super_admin: "Super Admin", admin: "Admin", cleaner: "Cleaner", client: "Client" };
  const label = labels[r] || r;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${className}`}
    >
      <Icon size={12} />
      {label}
    </span>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const { isSuperAdmin } = useAuth();

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const DetailRow = ({ label, value }) => (
    <div className="flex flex-wrap gap-2 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm font-medium min-w-[120px]">{label}:</span>
      <span className="text-slate-700 text-sm">{value ?? "-"}</span>
    </div>
  );

  const fetchUsers = async () => {
    setError("");
    try {
      const { data, error: rpcErr } = await supabase.rpc("get_all_users");
      if (rpcErr) {
        const { data: profileData, error: profileErr } = await supabase
          .from("profiles")
          .select("id, email, first_name, last_name, phone, postcode, city, role, created_at")
          .order("created_at", { ascending: false });
        if (profileErr) throw profileErr;
        setUsers(profileData || []);
        if ((profileData || []).length === 0) {
          setError("No users found. Run supabase/migrations/003_admin_users_rpc.sql in Supabase SQL Editor.");
        }
        return;
      }
      setUsers(data || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSetRole = async (userId, newRole) => {
    setUpdating(userId);
    try {
      const { error } = await supabase.rpc("set_user_role", {
        target_user_id: userId,
        new_role: newRole,
      });
      if (error) throw error;
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[280px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AdminPageHeader title="Users" subtitle="Manage user accounts and roles" icon={Users} />
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {error}
        </div>
      )}
      <AdminCard>
        {users.length === 0 ? (
          <AdminEmptyState message="No users found. Run migrations 001–004 in your Supabase SQL Editor." icon={Users} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold text-slate-700 w-8"></th>
                    <th className="text-left px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold text-slate-700">Name</th>
                    <th className="text-left px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold text-slate-700">Email</th>
                    <th className="text-left px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold text-slate-700">Role</th>
                    <th className="text-left px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold text-slate-700">Phone</th>
                    <th className="text-left px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold text-slate-700">City</th>
                    <th className="text-left px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold text-slate-700">Postcode</th>
                    <th className="text-left px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold text-slate-700">Joined</th>
                    {isSuperAdmin && (
                      <th className="text-left px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold text-slate-700">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <React.Fragment key={u.id}>
                      <tr
                        onClick={() => toggleExpand(u.id)}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                        <td className="px-4 lg:px-6 py-4">
                          {expandedId === u.id ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <span className="font-medium text-slate-800">
                            {u.first_name || u.last_name ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : "-"}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-slate-600 text-sm">{u.email || "-"}</td>
                        <td className="px-4 lg:px-6 py-4">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-slate-600 text-sm">{u.phone || "-"}</td>
                        <td className="px-4 lg:px-6 py-4 text-slate-600 text-sm">{u.city || "-"}</td>
                        <td className="px-4 lg:px-6 py-4 text-slate-600 text-sm">{u.postcode || "-"}</td>
                        <td className="px-4 lg:px-6 py-4 text-slate-600 text-sm">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
                        </td>
                        {isSuperAdmin && (
                          <td className="px-4 lg:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            {u.role !== "super_admin" && (
                              <div className="flex gap-2">
                                {u.role === "admin" ? (
                                  <button
                                    onClick={() => handleSetRole(u.id, "client")}
                                    disabled={updating === u.id}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {updating === u.id ? <Loader2 size={12} className="animate-spin" /> : null}
                                    Remove Admin
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSetRole(u.id, "admin")}
                                    disabled={updating === u.id}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {updating === u.id ? <Loader2 size={12} className="animate-spin" /> : null}
                                    Make Admin
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                      {expandedId === u.id && (
                        <tr>
                          <td colSpan={isSuperAdmin ? 9 : 8} className="bg-slate-50/80 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><User size={16} /> Profile</h4>
                                <div className="bg-white rounded-xl p-4 border border-slate-100">
                                  <DetailRow label="First name" value={u.first_name} />
                                  <DetailRow label="Last name" value={u.last_name} />
                                  <DetailRow label="Role" value={u.role} />
                                  <DetailRow label="User ID" value={u.id} />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><Mail size={16} /> Contact</h4>
                                <div className="bg-white rounded-xl p-4 border border-slate-100">
                                  <DetailRow label="Email" value={u.email} />
                                  <DetailRow label="Phone" value={u.phone} />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><MapPin size={16} /> Location & Date</h4>
                                <div className="bg-white rounded-xl p-4 border border-slate-100">
                                  <DetailRow label="City" value={u.city} />
                                  <DetailRow label="Postcode" value={u.postcode} />
                                  <DetailRow label="Joined" value={u.created_at ? new Date(u.created_at).toLocaleString() : null} />
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
              {users.map((u) => (
                <div key={u.id} className="p-4">
                  <div
                    onClick={() => toggleExpand(u.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium text-slate-800">
                        {u.first_name || u.last_name ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : "No name"}
                      </span>
                      <div className="flex items-center gap-2">
                        <RoleBadge role={u.role} />
                        {expandedId === u.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 break-all">{u.email || "-"}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span>Phone: {u.phone || "-"}</span>
                      <span>City: {u.city || "-"}</span>
                      <span>Postcode: {u.postcode || "-"}</span>
                      <span>Joined: {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</span>
                    </div>
                    {isSuperAdmin && u.role !== "super_admin" && (
                      <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {u.role === "admin" ? (
                          <button
                            onClick={() => handleSetRole(u.id, "client")}
                            disabled={updating === u.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600"
                          >
                            {updating === u.id ? "..." : "Remove Admin"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSetRole(u.id, "admin")}
                            disabled={updating === u.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-100 text-indigo-700"
                          >
                            {updating === u.id ? "..." : "Make Admin"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {expandedId === u.id && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm">
                      <div><span className="text-slate-500">First name:</span> {u.first_name || "-"}</div>
                      <div><span className="text-slate-500">Last name:</span> {u.last_name || "-"}</div>
                      <div><span className="text-slate-500">User ID:</span> <span className="text-xs break-all">{u.id}</span></div>
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

export default AdminUsers;
