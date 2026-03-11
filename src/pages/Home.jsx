import React, { useState } from "react";
import WhyChooseUs from "../components/Homecomponents/WhyChooseUs";
import Services from "../components/Homecomponents/Services";
import CTA from "../components/Homecomponents/CTA";
import Navbar from "../components/Homecomponents/Navbar";
import Footer from "../components/Homecomponents/Footer";
import { Link } from "react-router-dom";
import { MapPin, Search, CheckCircle2, XCircle } from "lucide-react";
import { useLocations } from "../context/LocationsContext";

const Home = () => {
  const [postcode, setPostcode] = useState("");
  const [checked, setChecked] = useState(null);
  const { locations, checkPostcodeInArea } = useLocations();

  const handleCheck = () => {
    if (!postcode?.trim()) return;
    setChecked(checkPostcodeInArea(postcode));
  };

  return (
    <div>
      <Navbar />
      <div className="font-jakarta">
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center py-10 px-4 bg-[#0f1216]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#448cff]/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="inline-block mb-8">
              <span className="px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 text-[#448cff] text-[13px] font-semibold tracking-wide uppercase">
                Premium Cleaning Services
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8">
              Professional Cleaning Service <br />
              in London <br />
              <span className="text-[#448cff]">You Can Trust</span>
            </h1>

            <p className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold text-white mb-8">
              100% Satisfaction Guaranteed{" "}
              <CheckCircle2 className="text-green-500" size={24} />
            </p>

            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12 font-medium">
              From regular house cleaning to deep cleans and specialized
              services, we make your home or office spotless while you focus on
              what matters most.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                to="/services"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-700 bg-gray-800/20 text-white px-20 py-5 rounded-2xl font-bold text-[15px] hover:bg-gray-800 transition-all group"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>

        {/* --- NEW: POSTCODE CHECKER SECTION --- */}
        <section className="z-20 mt-10  px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-300 rounded-2xl p-8 md:p-12 shadow-2xl shadow-blue-900/10 text-center">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-[#1e293b] leading-tight max-w-xl uppercase tracking-tighter">
                  Please enter your Post Code to check if we have started
                  Cleaning in your area
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="e.g. SW1A 1AA"
                    value={postcode}
                    onChange={(e) => { setPostcode(e.target.value); setChecked(null); }}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    className="w-full p-4 border border-gray-400 rounded-sm outline-none focus:border-[#448cff] transition-all font-bold text-slate-700 uppercase"
                  />
                </div>
                <button
                  onClick={handleCheck}
                  className="bg-[#448cff] hover:bg-blue-700 text-white px-10 py-4 rounded-sm font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Search size={16} /> Check
                </button>
              </div>
              {checked === true && (
                <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center gap-2 text-green-700 font-semibold">
                  <CheckCircle2 size={20} /> Yes! We serve your area.
                </div>
              )}
              {checked === false && (
                <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center gap-2 text-amber-700 font-semibold">
                  <XCircle size={20} /> We haven&apos;t started in your area yet. <Link to="/contact" className="underline">Contact us</Link> to request service.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- REST OF THE PAGE --- */}
        <WhyChooseUs />
        <Services />
        <CTA />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
