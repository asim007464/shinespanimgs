import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setError("");
      try {
        // Use RPC to get all users (includes auth.users, works when profiles empty or RLS blocks)
        const { data, error: rpcErr } = await supabase.rpc("get_all_users");
        if (rpcErr) {
          // Fallback to profiles table if RPC doesn't exist yet (migration not run)
          const { data: profileData, error: profileErr } = await supabase
            .from("profiles")
            .select("id, email, first_name, last_name, phone, postcode, city, role, created_at")
            .order("created_at", { ascending: false });
          if (profileErr) throw profileErr;
          setUsers(profileData || []);
          if ((profileData || []).length === 0) {
            setError("No users found. Run supabase/migrations/003_admin_users_rpc.sql in Supabase SQL Editor to enable user listing.");
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
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[280px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-8">Users</h1>
        {error && (
        <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {error}
        </div>
      )}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {users.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-slate-500 text-sm sm:text-base">
            No users found. Run migrations 001_profiles.sql, 002_admin_email_policy.sql, and 003_admin_users_rpc.sql in your Supabase SQL Editor.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-semibold text-slate-700">Name</th>
                    <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-semibold text-slate-700">Email</th>
                    <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-semibold text-slate-700">Role</th>
                    <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-semibold text-slate-700">Phone</th>
                    <th className="text-left px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-semibold text-slate-700">Postcode</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className="font-medium text-slate-800">
                          {u.first_name || u.last_name ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : "-"}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 text-sm">{u.email || "-"}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "cleaner"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {u.role || "client"}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 text-sm">{u.phone || "-"}</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 text-sm">{u.postcode || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {users.map((u) => (
                <div key={u.id} className="p-4 hover:bg-slate-50">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-medium text-slate-800">
                      {u.first_name || u.last_name ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : "No name"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "cleaner"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role || "client"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 break-all">{u.email || "-"}</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span>Phone: {u.phone || "-"}</span>
                    <span>Postcode: {u.postcode || "-"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
