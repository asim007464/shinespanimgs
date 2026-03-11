import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, Sparkles, TrendingUp, CalendarCheck, FileText } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    clients: 0,
    cleaners: 0,
    bookings: 0,
    cleanerApps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: "exact", head: true });
        const { count: appsCount } = await supabase.from("cleaner_applications").select("*", { count: "exact", head: true });
        const { data: users, error } = await supabase.rpc("get_all_users");
        if (error) {
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
            bookings: bookingsCount ?? 0,
            cleanerApps: appsCount ?? 0,
          });
          return;
        }
        const list = users || [];
        setStats({
          users: list.length,
          clients: list.filter((u) => (u.role || "client") === "client").length,
          cleaners: list.filter((u) => u.role === "cleaner").length,
          bookings: bookingsCount ?? 0,
          cleanerApps: appsCount ?? 0,
        });
      } catch {
        setStats({ users: 0, clients: 0, cleaners: 0, bookings: 0, cleanerApps: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      gradient: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "Clients",
      value: stats.clients,
      icon: UserCheck,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Cleaners",
      value: stats.cleaners,
      icon: Sparkles,
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
      shadow: "shadow-amber-500/20",
    },
    {
      label: "Bookings",
      value: stats.bookings,
      icon: CalendarCheck,
      gradient: "from-violet-500 to-purple-500",
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
      shadow: "shadow-violet-500/20",
    },
    {
      label: "Cleaner Apps",
      value: stats.cleanerApps,
      icon: FileText,
      gradient: "from-rose-500 to-pink-500",
      bg: "bg-rose-50",
      iconColor: "text-rose-600",
      shadow: "shadow-rose-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AdminPageHeader title="Dashboard" subtitle="Overview of your admin panel" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 group-hover:opacity-15 transition-opacity rounded-full -translate-y-1/2 translate-x-1/2 bg-indigo-400" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-4xl font-bold text-slate-800 mt-1">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center ${card.iconColor} shadow-lg ${card.shadow}`}
              >
                <card.icon className="w-7 h-7" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 sm:mt-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-500" />
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            Users
          </Link>
          <Link to="/admin/bookings" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            Bookings
          </Link>
          <Link to="/admin/cleaner-applications" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            Cleaner Applications
          </Link>
          <Link to="/admin/locations" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            Locations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
