import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Menu, Shield, Crown, FileText, CalendarCheck, MapPin } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
    { to: "/admin/cleaner-applications", icon: FileText, label: "Cleaner Apps" },
    { to: "/admin/locations", icon: MapPin, label: "Locations" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] sm:w-72 lg:static lg:w-64 xl:w-72 bg-white border-r border-slate-200 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <Link
            to="/"
            className="block p-6 border-b border-slate-200 bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <h1 className="text-xl font-bold text-white">
              Shine <span className="text-amber-300">&</span> Span
            </h1>
            <p className="text-xs text-indigo-200 mt-1 flex items-center gap-1.5">
              <Shield size={12} />
              Admin Panel
            </p>
          </Link>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`
                }
              >
                <item.icon size={20} className="shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="px-4 py-2 flex items-center gap-2">
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-semibold">
                  <Crown size={14} />
                  Super Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-semibold">
                  <Shield size={14} />
                  Admin
                </span>
              )}
            </div>
            <p className="px-4 py-1 text-sm text-slate-500 truncate" title={user?.email}>
              {user?.email}
            </p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full mt-2 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
            {isSuperAdmin ? (
              <>
                <Crown size={18} className="text-amber-500" />
                Super Admin
              </>
            ) : (
              <>
                <Shield size={18} className="text-indigo-500" />
                Admin
              </>
            )}
          </span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
