import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password`,
      });

      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        {authLoading && <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
      <div className="relative hidden w-1/2 lg:block h-full overflow-hidden">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-right bg-no-repeat"
          style={{
            backgroundImage: "url('./image.png')",
            filter: "brightness(0.5)",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute left-10 top-10 flex items-center space-x-2 text-white">
          <img src="./websitelogo.png" className="w-[100px]" alt="Logo" />
        </div>
        <div className="absolute bottom-10 left-10 right-10">
          <p className="max-w-md text-xl font-medium leading-relaxed text-white">
            "The platform that revolutionized how I manage my cleaning services."
          </p>
          <p className="mt-12 text-xs text-slate-400">© 2025 Shine & Span Inc.</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-20 h-full overflow-y-auto">
        <div className="w-full max-w-[420px] py-8">
          <Link
            to="/login"
            className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>

          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Forgot Password?
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-green-800">Check your email</p>
              <p className="text-sm text-green-700 mt-1">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block text-blue-600 font-medium hover:underline"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="relative mt-1.5">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
