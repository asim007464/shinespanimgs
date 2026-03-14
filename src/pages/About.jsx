import React from "react";
import CTA from "../components/Homecomponents/CTA";
import { images } from "../lib/images";
import ValuesSection from "../components/Aboutcomponents/ValueSection";
import TeamSection from "../components/Aboutcomponents/TeamSection";
import Navbar from "../components/Homecomponents/Navbar";

import Footer from "../components/Homecomponents/Footer";
const About = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="font-jakarta bg-white">
        {/* --- HEADER SECTION --- */}
        <section className="relative py-20 bg-[#0f1216] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#448cff]/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              About <span className="text-[#448cff]">SHINE & SPAN</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              We're more than just a cleaning service – we're your trusted
              partner in creating a clean, healthy, and comfortable environment
              for your home and business.
            </p>
          </div>
        </section>
        {/* --- MISSION SECTION (Matches your screenshot) --- */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Text Content */}
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-black text-[#1e293b] mb-8">
                  Our <span className="text-[#448cff]">Mission</span>
                </h2>
                <div className="space-y-6 text-gray-500 text-[17px] leading-relaxed">
                  <p>
                    Our mission is to deliver the best possible professional
                    cleaning services for both domestic and commercial clients,
                    combining high-quality results with eco-friendly practices
                    that protect our customers’ health and the environment.
                  </p>
                  <p>
                    We are committed to excellence and reliability in every job,
                    with a team of trained, insured, and vetted cleaning
                    professionals who take pride in their work and consistently
                    exceed client expectations.
                  </p>
                  <p>
                    As we grow and expand, we pledge to continuously improve and
                    innovate our services, finding new ways to enhance quality
                    and efficiency. In doing so, we aim to build lasting trust
                    with our clients and create cleaner, healthier spaces for
                    our community for years to come.
                  </p>
                </div>
              </div>

              {/* Image Content */}
              <div className="lg:w-1/2 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={images.aboutHeader}
                    alt="100% Satisfaction Guaranteed - Professional cleaning"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* --- value SECTION --- */}
        <ValuesSection></ValuesSection>
        {/* --- team section --- */}
        <TeamSection></TeamSection>
        {/* --- CALL TO ACTION --- */}
        <CTA />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default About;
