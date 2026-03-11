import React from "react";

export const AdminPageHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-6 sm:mb-8">
    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
      {Icon && <Icon size={28} className="text-indigo-500" />}
      {title}
    </h1>
    {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
  </div>
);
