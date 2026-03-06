import React, { useState, useEffect } from "react";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { supabase } from "../../lib/supabase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    clients: 0,
    cleaners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: users, error } = await supabase.rpc("get_all_users");
        if (error) {
          // Fallback to profiles if RPC not available
          const { count: userCount } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });
          const { count: clientCount } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "client");
          const { count: cleanerCount } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "cleaner");
          setStats({
            users: userCount ?? 0,
            clients: clientCount ?? 0,
            cleaners: cleanerCount ?? 0,
          });
          return;
        }
        const list = users || [];
        setStats({
          users: list.length,
          clients: list.filter((u) => (u.role || "client") === "client").length,
          cleaners: list.filter((u) => u.role === "cleaner").length,
        });
      } catch {
        setStats({ users: 0, clients: 0, cleaners: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "blue" },
    { label: "Clients", value: stats.clients, icon: Users, color: "green" },
    { label: "Cleaners", value: stats.cleaners, icon: Users, color: "amber" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {card.value}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <card.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 sm:mt-8 bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h2>
        <p className="text-slate-500 text-sm">
          Admin functionality can be extended here. Add booking management,
          cleaner assignments, and reports as needed.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
