import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Homecomponents/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Homecomponents/Footer";
import About from "./pages/About";
import ScrollToTop from "./ScrollToTop";
import Services from "./pages/Services";
import BookingCalculator from "./pages/BookingCalculator";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CleanerApplication from "./pages/Cleanerapplication";
import ChatBox from "./components/Homecomponents/ChatBox";
import JoinTeam from "./pages/JoinTeam";
import PricingGuide from "./pages/PricingGuide";
import ClientRegistration from "./pages/Clientregisteration";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import WebsiteGuard from "./pages/WebsiteGuard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCleanerApplications from "./pages/admin/AdminCleanerApplications";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminLocations from "./pages/admin/AdminLocations";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LocationsProvider } from "./context/LocationsContext";

const App = () => {
  return (
    <AuthProvider>
      <LocationsProvider>
      <Router>
        <WebsiteGuard />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/PricingGuide" element={<PricingGuide />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/BookingCalculator" element={<BookingCalculator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cleanerapplication" element={<CleanerApplication />} />
          <Route path="/ClientRegistration" element={<ClientRegistration />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="cleaner-applications" element={<AdminCleanerApplications />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="locations" element={<AdminLocations />} />
          </Route>
        </Routes>
        <ChatBox />
      </Router>
      </LocationsProvider>
    </AuthProvider>
  );
};

export default App;
