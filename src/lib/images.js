/**
 * Curated high-quality images for Shine & Span cleaning service.
 * All images from Unsplash - professional, eye-catching, and free to use.
 */

const UNSPLASH_BASE = "https://images.unsplash.com";
const IMG_OPTS = "w=800&q=85&fit=crop";

export const images = {
  // Auth pages - elegant, spacious clean interior
  authBackground: `${UNSPLASH_BASE}/photo-1600585154340-be6161a56a0c?${IMG_OPTS}`,
  
  // Logo - keep local for branding (path unchanged)
  logo: "/websitelogo.png",

  // About page - mission section (100% Satisfaction Guaranteed)
  aboutHeader: "/Servicesimgs/satisficaiton.jpg",

  // Service images - each matches the service type
  services: {
    general: `${UNSPLASH_BASE}/photo-1581578731548-c64695cc6952?${IMG_OPTS}`,
    deepCleaning: "/Servicesimgs/deepcleaning.jpg",
    carpet: "/Servicesimgs/Carpetcleaning.jpg",
    pressureWashing: "/pressure-washing.jpeg",
    gutter: "/Servicesimgs/guttercleaning.jpg",
    ovenFridge: "/Servicesimgs/ovenfridgecleanng.jpg",
    office: `${UNSPLASH_BASE}/photo-1497366216548-37526070297c?${IMG_OPTS}`,
    tenancy: `${UNSPLASH_BASE}/photo-1560448204-e02f11c3d0e2?${IMG_OPTS}`,
    airbnb: `${UNSPLASH_BASE}/photo-1522708323590-d24dbb6b0267?${IMG_OPTS}`,
  },

  // WebsiteGuard - cleaning tools from security folder (Vacuum, Spray, Broom, Mop)
  guard: {
    vacuum: "/security/photo-1558317374-067fb5f30001.jfif",
    spray: "/security/photo-1628177142898-93e36e4e3a50.avif",
    broom: "/security/premium_photo-1664443944967-75316b3d2987.avif",
    mop: "/security/premium_photo-1677529007590-0c51011f3650.avif",
  },
};
