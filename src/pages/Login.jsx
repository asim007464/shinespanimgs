import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { images } from "../lib/images";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!authLoading && user) {
      navigate(isAdmin ? "/admin" : from, { replace: true });
    }
  }, [user, authLoading, isAdmin, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
      <div className="relative hidden w-1/2 lg:block h-full overflow-hidden">
        {/* BACKGROUND DIV REPLACING THE IMG TAG */}
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-right bg-no-repeat"
          style={{
            backgroundImage: `url('${images.authBackground}')`,
            filter: "brightness(0.5)",
          }}
        />

        {/* Dark Overlay (Already in your code, keeping it for extra depth) */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Logo */}
        <div className="absolute left-10 top-10 flex items-center space-x-2 text-white">
          <img src={images.logo} className="w-[100px]" alt="Logo" />
        </div>

        {/* Testimonial & Footer */}
        <div className="absolute bottom-10 left-10 right-10">
          <p className="max-w-md text-xl font-medium leading-relaxed text-white">
            "The platform that revolutionized how I manage my cleaning services.
            Efficient, reliable, and user-friendly."
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-300">
            Sofia Davis
          </p>
          <p className="mt-12 text-xs text-slate-400">
            © 2025 Shine & Span Inc.
          </p>
        </div>
      </div>
      {/* RIGHT SECTION: Login Form */}
      {/* Added overflow-y-auto so if the screen is too small, the form scrolls inside its half */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-20 h-full overflow-y-auto">
        <div className="w-full max-w-[420px] py-8">
          {/* Back button */}
          <Link
            to="/"
            className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>

          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome to
              <span className=" ml-2 font-extrabold text-[#1e293b] tracking-tight">
                Shine <span className="text-[#448cff]">&</span> Span
              </span>
            </h1>
          </div>

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
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          {/* <div className="mt-10">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Demo Credentials
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {demoCredentials.map((cred) => (
                <div
                  key={cred.role}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm border border-slate-100">
                      {cred.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {cred.role}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-slate-500">
                      {cred.email}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400">
                      {cred.pass}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Footer Links */}
          <div className="mt-10 space-y-2 text-center text-sm">
            <p className="text-slate-500 ml-1">
              New Client?{" "}
              <Link
                to="/ClientRegistration"
                className="font-semibold text-blue-600 hover:underline"
              >
                Register here
              </Link>
            </p>
            <p className="text-slate-500">
              New Cleaner?{" "}
              <Link
                to="/cleanerapplication"
                className="font-semibold text-blue-600 hover:underline"
              >
                Apply here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
