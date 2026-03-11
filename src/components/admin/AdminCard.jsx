import React from "react";

export const AdminCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const AdminEmptyState = ({ message, icon: Icon }) => (
  <div className="p-12 sm:p-16 text-center">
    {Icon && (
      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon size={28} />
      </div>
    )}
    <p className="text-slate-500 text-sm sm:text-base">{message}</p>
  </div>
);
