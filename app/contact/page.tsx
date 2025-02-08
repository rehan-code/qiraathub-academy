"use client";

import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll use mailto
    const mailtoLink = `mailto:info@qiraathub.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Contact Us
        </h1>

        {/* Contact Information */}
        <div className="grid md:grid-cols-5 gap-12">
          {/* Left Column - Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                    <FaPhone className="text-primary w-5 h-5" />
                  </div>
                  <a
                    href="tel:+8801631362717"
                    className="text-gray-600 hover:text-primary transition-colors duration-300"
                  >
                    +880 1631-362717
                  </a>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                    <FaEnvelope className="text-primary w-5 h-5" />
                  </div>
                  <a
                    href="mailto:info@qiraathub.com"
                    className="text-gray-600 hover:text-primary transition-colors duration-300"
                  >
                    info@qiraathub.com
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  Follow Us
                </h3>
                <div className="flex space-x-6">
                  <a
                    href="https://www.youtube.com/@qiraat"
                    className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors duration-300"
                  >
                    <FaYoutube className="w-6 h-6 text-primary" />
                  </a>
                  <a
                    href="https://www.facebook.com/QiraatHub/"
                    className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors duration-300"
                  >
                    <FaFacebook className="w-6 h-6 text-primary" />
                  </a>
                  <a
                    href="https://x.com/QiraatHub"
                    className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors duration-300"
                  >
                    <FaTwitter className="w-6 h-6 text-primary" />
                  </a>
                  <a
                    href="https://www.instagram.com/qiraathub/"
                    className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors duration-300"
                  >
                    <FaInstagram className="w-6 h-6 text-primary" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="md:col-span-3">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={8}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-y"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium text-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
