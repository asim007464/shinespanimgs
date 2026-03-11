import React from "react";
import { useLocations } from "../../context/LocationsContext";

const FAQ = () => {
  const { locations } = useLocations();
  const areasText = locations.length > 0
    ? locations.map((l) => `${l.city} (${l.postcode})`).join(", ")
    : "London and surrounding areas";

  const faqs = [
    {
      question: "How do I get a quote?",
      answer:
        "Simply fill out the contact form where in we give you an approximate quote. This is what you pay us at first clean. As every property is diffrent with diffrent cleaning needs, we will provide you an exact quote for on going cleaning, after the first practical clean.",
    },
    {
      question: "Are you insured?",
      answer:
        "Yes, we're fully insured and bonded. Your property and our team are protected with comprehensive coverage.",
    },
    {
      question: "What areas do you serve?",
      answer: `We serve ${areasText}. Contact us to confirm service availability in your location.`,
    },
    {
      question: "Do I need to be home?",
      answer:
        "Not necessarily. Many clients provide access and aren't home during cleaning. We can discuss the best arrangement for your situation.",
    },
  ];

  return (
    <section className="py-24 bg-[#fcfdfe] font-jakarta">
      <div className="max-w-7xl mx-auto px-4">
        {/* --- Header --- */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#1e293b] mb-6 tracking-tight">
            Frequently Asked <span className="text-[#448cff]">Questions</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium opacity-80">
            Have questions? Here are some quick answers to help you get started.
          </p>
        </div>

        {/* --- FAQ Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-500 group"
            >
              {/* Question */}
              <div className="flex items-start gap-4 mb-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-[#448cff] group-hover:scale-150 transition-transform"></div>
                <h3 className="text-xl font-black text-[#1e293b] leading-tight">
                  {faq.question}
                </h3>
              </div>

              {/* Answer */}
              <p className="text-gray-500 leading-relaxed text-[15px] pl-6 font-medium">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
