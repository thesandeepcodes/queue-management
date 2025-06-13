// src/components/layout/MainLayout.js
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar /> {/* ✅ Only once */}
      <main className="min-h-screen px-4 py-8 bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
}
