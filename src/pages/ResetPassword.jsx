import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { images } from "../lib/images";
import { supabase } from "../lib/supabase";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    if (hash && type === "recovery") {
      supabase.auth.verifyOtp({ token_hash: hash, type: "recovery" }).catch((err) => {
        if (err) setError("Invalid or expired reset link. Please request a new one.");
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
      <div className="relative hidden w-1/2 lg:block h-full overflow-hidden">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-right bg-no-repeat"
          style={{
            backgroundImage: `url('${images.authBackground}')`,
            filter: "brightness(0.5)",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute left-10 top-10 flex items-center space-x-2 text-white">
          <img src={images.logo} className="w-[100px]" alt="Logo" />
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
              Set New Password
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              Enter your new password below.
            </p>
          </div>

          {success ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
              <p className="font-semibold text-green-800">Password updated!</p>
              <p className="text-sm text-green-700 mt-1">Redirecting to login...</p>
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
                  New Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-12 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
