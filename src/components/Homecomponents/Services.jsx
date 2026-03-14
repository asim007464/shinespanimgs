import React from "react";
import { Link } from "react-router-dom";
import { images } from "../../lib/images";

const Services = () => {
  const serviceList = [
    {
      title: "General House Cleaning",
      desc: "Regular cleaning service for busy homeowners looking for a consistently spotless environment.",
      image: images.services.general,
    },
    {
      title: "Deep Cleaning",
      desc: "Intensive cleaning for hard-to-reach areas, perfect for seasonal refreshes or move-in/out.",
      image: images.services.deepCleaning,
    },
    {
      title: "Carpet Cleaning",
      desc: "Professional steam cleaning for carpets and rugs using eco-friendly, deep-stain removal tech.",
      image: images.services.carpet,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-[#1e293b] mb-4">
            Our <span className="text-[#448cff]">Services</span>
          </h2>
          <div className="w-16 h-1 bg-[#448cff] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 text-lg">
            From regular maintenance to deep cleaning, we offer comprehensive
            cleaning solutions for homes and businesses.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {serviceList.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-[16px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-2xl font-bold text-[#1e293b] mb-3 group-hover:text-[#448cff] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-8 text-[15px]">
                  {service.desc}
                </p>

                <Link
                  to="/register"
                  className=" bg-[#448cff] px-5 inline-block  hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="mt-16 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-100 hover:border-[#448cff] hover:text-[#448cff] text-gray-600 font-bold rounded-2xl transition-all group"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
