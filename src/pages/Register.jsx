import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { supabase } from "../lib/supabase";
import "react-datepicker/dist/react-datepicker.css";

import {
  Plus,
  Minus,
  Check,
  HelpCircle,
  Clock,
  Refrigerator,
  Microwave,
  CheckCircle2,
  Calendar,
  Info,
  Utensils,
  Lock,
  ChevronLeft,
  MapPin,
  User,
  CreditCard,
} from "lucide-react";
import Navbar from "../components/Homecomponents/Navbar";
import Footer from "../components/Homecomponents/Footer";

const Register = () => {
  const [step, setStep] = useState(1);

  // --- SCROLL TO TOP FUNCTIONALITY ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // --- Date Logic for Constraints ---
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const lastDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0)
    .toISOString()
    .split("T")[0];

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- Centralized Form State ---
  const [formData, setFormData] = useState({
    postcode: "",
    serviceType: [],
    propertyType: "",
    bedrooms: 1,
    bathrooms: 1,
    extras: [],
    duration: null,
    products: "",
    frequency: "",
    email: "",
    details: "",
    arrivalTime: "09:00",
    accessMethod: "Spare keys",
    firstCleanDate: null,
    firstName: "",
    surname: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    addressPostcode: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const updateData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => {
    setFormError("");
    setStep((prev) => Math.min(prev + 1, 4));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleComplete = async () => {
    const { postcode, serviceType, firstName, surname, phone, email, addressLine1, city, addressPostcode } = formData;
    if (!postcode?.trim()) {
      setFormError("Please enter your postcode.");
      return;
    }
    if (!serviceType?.length) {
      setFormError("Please select at least one service type.");
      return;
    }
    if (!firstName?.trim() || !surname?.trim() || !phone?.trim() || !email?.trim()) {
      setFormError("Please fill in all required address fields.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("bookings").insert({
        user_id: user?.id || null,
        postcode: postcode.trim(),
        service_types: formData.serviceType,
        property_type: formData.propertyType || null,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        extras: formData.extras,
        duration_hours: formData.duration,
        products: formData.products || null,
        frequency: formData.frequency || null,
        first_clean_date: formData.firstCleanDate ? formData.firstCleanDate.toISOString().split("T")[0] : null,
        arrival_time: formData.arrivalTime,
        access_method: formData.accessMethod,
        first_name: firstName.trim(),
        surname: surname.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address_line1: addressLine1?.trim() || null,
        address_line2: formData.addressLine2?.trim() || null,
        city: city?.trim() || null,
        address_postcode: addressPostcode?.trim() || null,
      });
      if (error) throw error;
      alert("Booking request submitted successfully! We'll contact you shortly.");
      window.location.reload();
    } catch (err) {
      setFormError(err.message || "Failed to submit booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar />

      <main className="max-w-6xl  mx-auto px-6 py-12">
        {/* --- 1. Progress Stepper --- */}
        <div className="flex items-center  justify-center space-x-2 md:space-x-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
          <StepItem label="Cleaning" status={step > 1 ? "done" : "active"} />
          <Line />
          <StepItem
            label="Time"
            status={step === 2 ? "active" : step > 2 ? "done" : "idle"}
          />
          <Line />
          <StepItem
            label="Address"
            status={step === 3 ? "active" : step > 3 ? "done" : "idle"}
          />
          <Line />
          <StepItem label="Payment" status={step === 4 ? "active" : "idle"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* --- LEFT: Form Section --- */}
          <div className="lg:col-span-2">
            {/* STEP 1: CUSTOMISE CLEAN */}
            {step === 1 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-extrabold text-slate-900">
                  Customise your clean
                </h1>

                <Section title="Your postcode">
                  <input
                    type="text"
                    placeholder="Postcode"
                    className="form-input p-4 hover:border-gray-500 border-gray-300 border w-full md:w-full rounded-sm"
                    onChange={(e) => updateData({ postcode: e.target.value })}
                    value={formData.postcode}
                  />
                </Section>

                <Section title="Service Type *">
                  <div className="flex flex-wrap gap-3">
                    {[
                      "General House Cleaning",
                      "Deep Cleaning",
                      "Carpet Cleaning",
                      "Oven Cleaning",
                      "Pressure Washing",
                      "Gutter Cleaning",
                      "Office Cleaning",
                      "End of Tenancy Cleaning",
                      "Airbnb Cleaning",
                    ].map((opt) => (
                      <Chip
                        key={opt}
                        label={opt}
                        active={formData.serviceType.includes(opt)}
                        onClick={() => {
                          const current = formData.serviceType;
                          const updated = current.includes(opt)
                            ? current.filter((s) => s !== opt)
                            : [...current, opt];
                          updateData({ serviceType: updated });
                        }}
                      />
                    ))}
                  </div>
                </Section>

                <Section title="Property Type">
                  <select
                    value={formData.propertyType}
                    onChange={(e) =>
                      updateData({ propertyType: e.target.value })
                    }
                    className="form-input p-4 w-full  hover:border-gray-500 border-gray-300 border rounded-sm appearance-none bg-white cursor-pointer"
                  >
                    <option value="" disabled>
                      Select property type
                    </option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Office">Office</option>
                    <option value="Commercial Space">Commercial Space</option>
                  </select>
                </Section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Section title="How many rooms?">
                    <select
                      value={formData.bedrooms}
                      onChange={(e) =>
                        updateData({ bedrooms: parseInt(e.target.value) })
                      }
                      className="form-input p-4 w-full  hover:border-gray-500 border-gray-300 border rounded-sm appearance-none bg-white cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Room" : "Rooms"}
                        </option>
                      ))}
                    </select>
                  </Section>

                  <Section title="How many bathrooms?">
                    <select
                      value={formData.bathrooms}
                      onChange={(e) =>
                        updateData({ bathrooms: parseInt(e.target.value) })
                      }
                      className="form-input p-4 w-full  hover:border-gray-500 border-gray-300 border rounded-sm appearance-none bg-white cursor-pointer"
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Bathroom" : "Bathrooms"}
                        </option>
                      ))}
                    </select>
                  </Section>
                </div>

                <Section title="More Tasks">
                  <div className="grid grid-cols-2 gap-4">
                    <ExtraCard
                      label="Inside fridge"
                      icon={<Refrigerator size={32} />}
                      active={formData.extras.includes("fridge")}
                      onClick={() =>
                        updateData({
                          extras: formData.extras.includes("fridge")
                            ? formData.extras.filter((e) => e !== "fridge")
                            : [...formData.extras, "fridge"],
                        })
                      }
                    />
                    <ExtraCard
                      label="Kitchen"
                      icon={<Utensils size={32} />}
                      active={formData.extras.includes("cabinets")}
                      onClick={() =>
                        updateData({
                          extras: formData.extras.includes("cabinets")
                            ? formData.extras.filter((e) => e !== "cabinets")
                            : [...formData.extras, "cabinets"],
                        })
                      }
                    />
                    <ExtraCard
                      label="Inside oven"
                      icon={<Microwave size={32} />}
                      active={formData.extras.includes("oven")}
                      onClick={() =>
                        updateData({
                          extras: formData.extras.includes("oven")
                            ? formData.extras.filter((e) => e !== "oven")
                            : [...formData.extras, "oven"],
                        })
                      }
                    />
                  </div>
                </Section>

                <Section
                  title="How many hours of cleaning would you like?"
                  subtitle="The minimum duration is 2 hours. We will recommend the exact number of cleaning hours once we have done the first cleaning."
                >
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                    {[2, 3, 4, 5, 6, 7, 8].map((h) => (
                      <button
                        key={h}
                        onClick={() => updateData({ duration: h })}
                        className={`p-4 rounded-xl border-2 font-bold transition-all ${
                          formData.duration === h
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-slate-200 text-slate-400"
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section
                  title="Cleaning products"
                  subtitle="Includes sprays and cloths. Your cleaner cannot bring a vacuum, mop or bucket."
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() =>
                        updateData({ products: "Bring cleaning products" })
                      }
                      className={`relative p-8 flex items-center justify-center border-2 rounded-2xl font-bold transition-all text-[15px] ${
                        formData.products === "Bring cleaning products"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-100 hover:border-slate-200 text-slate-700"
                      }`}
                    >
                      Bring cleaning products (+ £12.00)
                    </button>

                    <button
                      onClick={() => updateData({ products: "I will provide" })}
                      className={`relative p-8 flex items-center justify-center border-2 rounded-2xl font-bold transition-all text-[15px] ${
                        formData.products === "I will provide"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-100 hover:border-slate-200 text-slate-700"
                      }`}
                    >
                      I will provide
                    </button>
                  </div>
                </Section>
                <Section title="How often would like house/office cleaning?">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        "daily",
                        "twice a week",
                        "weekly",
                        "every 2 weeks",
                        "1 off deep clean",
                        "In case of  Emergency same day clean then contact us", // Shortened for cleaner UI
                      ].map((h) => {
                        const isEmergency = h
                          .toLowerCase()
                          .includes("emergency");

                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => updateData({ frequency: h })}
                            className={`relative p-4 rounded-xl border-2 font-bold transition-all text-sm flex items-center justify-center ${
                              formData.frequency === h
                                ? isEmergency
                                  ? "border-blue-600 bg-blue-50 text-blue-600"
                                  : "border-blue-600 bg-blue-50 text-blue-600" // Normal Active
                                : isEmergency
                                  ? "border-slate-200 text-slate-400 hover:border-slate-200"
                                  : "border-slate-200 text-slate-400 hover:border-slate-200" // Normal Idle
                            }`}
                          >
                            <span className="text-center">{h}</span>

                            {/* Pulsing "Urgent" label instead of an icon */}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Section>

                <Section title="Email">
                  <input
                    type="email"
                    value={formData.email}
                    className="form-input w-full p-4 hover:border-gray-500 border-gray-300 border md:w-full rounded-sm"
                    onChange={(e) => updateData({ email: e.target.value })}
                  />
                </Section>
              </div>
            )}

            {/* STEP 2: TIME & ACCESS */}
            {step === 2 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <h1 className="text-3xl font-extrabold text-slate-900">
                  What time would you like your cleaner to arrive?
                </h1>
                <div>
                  <div className="w-full mb-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-center font-medium text-slate-500">
                    Daytime 7:00 am - 5:00 pm
                  </div>

                  <Section title="Cleaning date">
                    <div className="relative ">
                      <DatePicker
                        selected={formData.firstCleanDate}
                        onChange={(date) =>
                          updateData({ firstCleanDate: date })
                        }
                        minDate={new Date()}
                        monthsShown={2}
                        className="form-input w-full  rounded-sm border border-gray-200 p-4 outline-none bg-white"
                      />
                      <Calendar
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800 z-10 pointer-events-none"
                      />
                    </div>
                  </Section>
                </div>
                <div className="space-y-8">
                  <TimeGrid
                    label="Choose arrival time "
                    times={[
                      "07:00",
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                    ]}
                    selected={formData.arrivalTime}
                    onSelect={(t) => updateData({ arrivalTime: t })}
                  />
                </div>
                <Section title="How can your cleaner access the property?">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Spare keys",
                      "Someone at home / office",
                      "Concierge",
                      "Key safe",
                      "Key hidden",
                    ].map((m) => (
                      <button
                        key={m}
                        onClick={() => updateData({ accessMethod: m })}
                        className={`p-5 text-left border-2 rounded-xl font-semibold transition-all ${
                          formData.accessMethod === m
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* STEP 3: ADDRESS DETAILS */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <h1 className="text-3xl font-extrabold text-slate-900">
                  Address details
                </h1>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      className="form-input w-full  hover:border-gray-500 border-gray-300 border p-2"
                      onChange={(e) =>
                        updateData({ firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">
                      Surname *
                    </label>
                    <input
                      type="text"
                      value={formData.surname}
                      className="form-input w-full hover:border-gray-500 border-gray-300 border p-2"
                      onChange={(e) => updateData({ surname: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    className="form-input w-full hover:border-gray-500 border-gray-300 border p-2"
                    onChange={(e) => updateData({ phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    className="form-input w-full hover:border-gray-500 border-gray-300 border p-2"
                    onChange={(e) =>
                      updateData({ addressLine1: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    className="form-input w-full hover:border-gray-500 border-gray-300 border p-2"
                    onChange={(e) =>
                      updateData({ addressLine2: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    className="form-input w-full hover:border-gray-500 border-gray-300 border p-2"
                    onChange={(e) => updateData({ city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={formData.addressPostcode}
                    className="form-input  w-full bg-slate-50 hover:border-gray-500 border-gray-300 border p-2"
                    onChange={(e) =>
                      updateData({ addressPostcode: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT */}
            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {formError && (
                  <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-700 text-sm">
                    {formError}
                  </div>
                )}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start space-x-3 text-sm text-blue-700">
                  <Info size={20} className="shrink-0 mt-0.5" />
                  <p>
                    You can edit, reschedule or cancel your cleans with 24 hours
                    notice.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-start space-x-3 text-sm text-green-700">
                  <Lock size={20} className="shrink-0 mt-0.5" />
                  <p>
                    We use <strong>Stripe</strong> for secure payments.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">
                      Card number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 1234 1234 1234"
                      className="form-input w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600">
                        Expiry date
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="form-input w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="form-input w-full"
                      />
                    </div>
                  </div>
                  <label className="flex items-start space-x-3 group cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-sm text-slate-500 leading-relaxed">
                      I accept the terms and conditions.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT: Summary Sidebar --- */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-8">Summary</h2>
              <div className="space-y-5">
                {/* SERVICE: Joins array or shows -- */}
                <SummaryRow
                  label="Service"
                  value={
                    formData.serviceType && formData.serviceType.length > 0
                      ? formData.serviceType.join(", ")
                      : "--"
                  }
                />

                {/* PRODUCTS */}
                <SummaryRow
                  label="Products"
                  value={formData.products || "--"}
                />

                {/* PROPERTY */}
                <SummaryRow
                  label="Property"
                  value={formData.propertyType || "--"}
                />

                {/* DURATION */}
                <SummaryRow
                  label="Duration"
                  value={
                    formData.duration ? `${formData.duration} hours` : "--"
                  }
                />

                {/* FREQUENCY */}
                <SummaryRow
                  label="Frequency"
                  value={formData.frequency || "--"}
                />

                {/* FIRST CLEAN DATE: Centered format DD-MM-YYYY */}
                <SummaryRow
                  label="First Clean"
                  value={
                    formData.firstCleanDate
                      ? (() => {
                          const d = new Date(formData.firstCleanDate);
                          const day = String(d.getDate()).padStart(2, "0");
                          const month = String(d.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const year = d.getFullYear();
                          return `${day}-${month}-${year}`;
                        })()
                      : "--"
                  }
                />

                {/* ADDRESS SECTION (Step 3+) */}
                {step >= 3 && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Address
                    </p>
                    <p className="text-sm text-slate-700 leading-tight">
                      {formData.addressLine1
                        ? `${formData.addressLine1}, `
                        : ""}
                      {formData.city ? `${formData.city}, ` : ""}
                      {formData.addressPostcode || "--"}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-10 flex gap-3">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 py-4 rounded-xl font-bold transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={step === 4 ? handleComplete : nextStep}
                  disabled={step === 4 && submitting}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {step === 4 ? (submitting ? "Submitting..." : "Complete") : "Continue"}
                </button>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full mt-6 text-red-500 text-sm font-semibold hover:underline"
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .form-input { @apply p-3.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker { display: flex !important; border: none !important; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

// ... (Sub-components: StepItem, Line, Section, Chip, ExtraCard, FrequencyCard, TimeGrid, SummaryRow) ...
const StepItem = ({ label, status }) => (
  <div className="flex items-center space-x-2 shrink-0">
    {status === "done" ? (
      <div className="bg-blue-600 rounded-full p-1">
        <Check size={12} className="text-white" />
      </div>
    ) : (
      <div
        className={` md:w-6 md:h-6 w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
          status === "active"
            ? "border-blue-600 text-blue-600"
            : "border-slate-300 text-slate-300"
        }`}
      />
    )}
    <span
      className={`text-sm font-bold ${
        status === "active" ? "text-blue-600" : "text-slate-400"
      }`}
    >
      {label}
    </span>
  </div>
);

const Line = () => <div className="w-12 h-px bg-slate-200 hidden md:block" />;

const Section = ({ title, subtitle, children }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    {subtitle && (
      <p className="text-sm text-slate-500 leading-relaxed">{subtitle}</p>
    )}
    <div className="pt-1">{children}</div>
  </div>
);

const Chip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${
      active
        ? "bg-blue-50 border-blue-600 text-blue-600 ring-1 ring-blue-600"
        : "border-slate-200 text-slate-500 hover:border-slate-300"
    }`}
  >
    {label}
  </button>
);

const ExtraCard = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-8 border-2 rounded-2xl transition-all space-y-4 ${
      active
        ? "border-blue-600 bg-blue-50/50"
        : "border-slate-100 hover:border-slate-200"
    }`}
  >
    <div className={active ? "text-blue-600" : "text-slate-300"}>{icon}</div>
    <span className="font-bold text-slate-700">{label}</span>
  </button>
);

const FrequencyCard = ({ title, active, onClick, bullets }) => (
  <div
    onClick={onClick}
    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
      active ? "border-blue-600" : "border-slate-100 hover:border-slate-200"
    }`}
  >
    <div className="flex justify-between mb-4 font-bold">
      <h4>{title}</h4>
      <span>£100.00</span>
    </div>
    <ul className="space-y-2">
      {bullets.map((b, i) => (
        <li key={i} className="flex items-center text-sm text-slate-500">
          <Check size={14} className="text-blue-500 mr-2" />
          {b}
        </li>
      ))}
    </ul>
  </div>
);

const TimeGrid = ({ label, times, selected, onSelect }) => (
  <div className="space-y-4">
    {/* Label */}
    <p className="text-lg font-black text-slate-900 tracking-tight">{label}</p>

    {/* Styled Info Box */}
    <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
      <div className="mt-0.5">
        <Info size={18} className="text-[#448cff]" />
      </div>
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        Our service is provided from{" "}
        <span className="text-slate-900 font-bold">7am to 7pm</span>. Note that
        prices vary slightly for slots outside the 9am to 5pm window.
      </p>
    </div>

    {/* Time Slots Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {times.map((t) => {
        // Check if the time is "Peak" or "Off-peak" (Optional visual hint)
        const hour = parseInt(t.split(":")[0]);
        const isOffPeak = hour < 9 || hour >= 17;

        return (
          <button
            key={t}
            type="button" // Important to prevent form submission
            onClick={() => onSelect(t)}
            className={`group relative py-4 border-2 rounded-2xl text-[15px] font-bold transition-all duration-300 ${
              selected === t
                ? "border-[#448cff] bg-[#448cff] text-white shadow-lg shadow-blue-200"
                : "border-slate-100 text-slate-500 hover:border-[#448cff] hover:text-[#448cff] bg-white"
            }`}
          >
            {t}
            {/* Small subtle indicator for off-peak pricing */}
            {isOffPeak && selected !== t && (
              <span className="absolute top-1 right-2 text-[10px] text-slate-300 font-bold">
                £
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between items-start text-sm gap-4">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="font-bold text-slate-800 text-left">{value || "-"}</span>
  </div>
);
export default Register;
