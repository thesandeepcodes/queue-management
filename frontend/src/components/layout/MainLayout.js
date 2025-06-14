// src/components/layout/MainLayout.js
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar /> {/* ✅ Only once */}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
