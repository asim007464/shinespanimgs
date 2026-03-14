import React from "react";
import Inclusions from "../components/Servicescomponents/Inclusions";
import { images } from "../lib/images";
import BookCTA from "../components/Servicescomponents/BookCTA";
import Navbar from "../components/Homecomponents/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/Homecomponents/Footer";
const Services = () => {
  const serviceData = [
    {
      title: "General House Cleaning",
      desc: "Routine upkeep to keep your home fresh and comfortable. We dust, vacuum, and clean kitchens and bathrooms, tailoring each visit to your needs and busy schedule.",
      points: [
        "Dusting and vacuuming",
        "Bathroom and kitchen cleaning",
        "Ongoing upkeep",
        "Flexible scheduling",
      ],
      image: images.services.general,
      icon: (
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      ),
    },
    {
      title: "Deep Cleaning",
      desc: "A thorough top-to-bottom clean targeting built-up dirt and overlooked areas. We cover details standard cleaning misses—from skirting boards to inside cabinets and limescale.",
      points: [
        "Detailed deep cleaning",
        "Hard-to-reach areas",
        "Cabinet interiors",
        "Professional equipment",
      ],
      image: images.services.deepCleaning,
      icon: (
        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
      ),
    },
    {
      title: "Carpet Cleaning",
      desc: "A deep clean for carpets and rugs that removes dirt, stains, and allergens. We use hot water extraction (steam cleaning) to leave fibres fresh, clean, and quick to dry.",
      points: [
        "Steam cleaning",
        "Stain removal",
        "Allergen elimination",
        "Quick drying",
      ],
      image: images.services.carpet,
      icon: (
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      ),
    },
    {
      title: "Pressure Washing",
      desc: "High-pressure outdoor cleaning for patios, driveways, and decks, removing dirt, moss, algae, and stains using an effective, eco-friendly process.",
      points: [
        "Patio cleaning",
        "Driveway cleaning",
        "Moss and algae removal",
        "Eco-friendly process",
      ],
      image: images.services.pressureWashing,
      icon: (
        <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      ),
    },
    {
      title: "Gutter Cleaning",
      desc: "Clear blockages from gutters and downspouts. We remove leaves, moss, and debris safely and thoroughly to protect your home from leaks and structural issues.",
      points: [
        "Complete debris removal",
        "Safety equipment",
        "Damage prevention",
        "Professional service",
      ],
      image: images.services.gutter,
      icon: <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
    },
    {
      title: "Oven & Fridge Cleaning",
      desc: "Specialised cleaning for ovens and fridges that tackles tough grease and built-up grime. We deep-clean these appliances inside and out for a hygienic state.",
      points: [
        "Oven deep cleaning",
        "Fridge interior cleaning",
        "Grease removal",
        "Food-safe cleaning",
      ],
      image: images.services.ovenFridge,
      icon: (
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      ),
    },
    {
      title: "Office Cleaning",
      desc: "A cleaning service for offices to maintain a healthy workspace and professional appearance. We cover desks, floors, bins, kitchens, and washrooms.",
      points: [
        "Workspace cleaning",
        "Sanitisation",
        "Flexible scheduling",
        "Professional standards",
      ],
      image: images.services.office,
      icon: (
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      ),
    },
    {
      title: "End of Tenancy Cleaning",
      desc: "A full top-to-bottom clean at move-out to help pass inspections and secure your deposit. We leave the property spotless and move-out ready.",
      points: [
        "Deposit protection",
        "Comprehensive cleaning",
        "Agency-approved",
        "Move-out ready",
      ],
      image: images.services.tenancy,
      icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      title: "Airbnb Cleaning",
      desc: "Turnover cleaning for your Airbnb to keep it guest-ready. We handle full cleanings, linen changes, and sanitising with a quick, reliable turnaround.",
      points: [
        "Guest turnover cleaning",
        "Linen service",
        "Quick turnaround",
        "Superhost support",
      ],
      image: images.services.airbnb,
      icon: (
        <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      ),
    },
  ];

  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-[#fcfdfe] font-jakarta ">
        {/* --- Header Section --- */}
        <section className="py-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-6 tracking-tight">
            Our Cleaning <span className="text-[#448cff]">Services</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium">
            Professional cleaning solutions tailored to your needs. From regular
            house cleaning to specialized services, we’ve got you covered.
          </p>
        </section>
        {/* --- Services Grid --- */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceData.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-500"
              >
                {/* Image Container (Top) */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Icon Overlay */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-[#007BFF] text-white rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      {service.icon}
                    </svg>
                  </div>
                </div>

                {/* Text Container (Bottom) */}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-[#1e293b] mb-3 group-hover:text-[#448cff] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-500 text-[14px] leading-relaxed mb-6 line-clamp-3">
                    {service.desc}
                  </p>

                  {/* Bullet Points */}
                  <ul className="space-y-2 mb-8">
                    {service.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-center text-gray-500 text-[13px] font-semibold"
                      >
                        <span className="w-1.5 h-1.5 bg-[#448cff] rounded-full mr-2 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button - mt-auto keeps it aligned at the bottom */}
                  <div className="mt-auto">
                    <Link
                      to="/register"
                      className="w-full px-5 bg-[#007BFF] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95 shadow-md shadow-blue-50"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Inclusions></Inclusions>
        <BookCTA></BookCTA>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Services;
