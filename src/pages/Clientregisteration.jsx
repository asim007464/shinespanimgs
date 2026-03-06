import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ClientRegistration = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "", // New field added
    password: "",
    postcode: "",
    city: "London",
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            postcode: formData.postcode,
            city: formData.city,
            role: "client",
          },
        },
      });
      if (signUpError) throw signUpError;
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          postcode: formData.postcode,
          city: formData.city,
          role: "client",
        });
      } catch {
        // Profile may be created by trigger; ignore upsert errors
      }
      alert("Account created successfully! Check your email to confirm.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
      {/* --- LEFT SECTION: Image & Branding --- */}
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

      {/* --- RIGHT SECTION: Registration Form --- */}
      <div className="flex w-full flex-col lg:w-1/2 h-full overflow-y-auto">
        <div className="w-full max-w-[500px] mx-auto px-6 py-12 md:px-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Create Client Account
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Join Shine & Span for a cleaner, healthier home.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                placeholder="John"
                value={formData.firstName}
                onChange={(v) => updateField("firstName", v)}
              />
              <Input
                label="Last Name *"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(v) => updateField("lastName", v)}
              />
            </div>

            <Input
              label="Email Address *"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(v) => updateField("email", v)}
            />

            {/* NEW CONTACT NUMBER INPUT */}
            <Input
              label="Contact Number *"
              type="tel"
              placeholder="07123 456789"
              value={formData.phone}
              onChange={(v) => updateField("phone", v)}
            />

            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(v) => updateField("password", v)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Postcode (London) *"
                placeholder="e.g. SW1A 1AA"
                value={formData.postcode}
                onChange={(v) => updateField("postcode", v)}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  type="text"
                  value="London"
                  disabled
                  className="w-full p-3 border border-gray-400 rounded-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 font-semibold rounded-sm shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-bold underline hover:text-blue-800"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component for Clean Input Styling ---
const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-400 rounded-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/5 font-medium text-slate-700"
    />
  </div>
);

export default ClientRegistration;
