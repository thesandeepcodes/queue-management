"use client";

import Button from '@/components/base/Button';
import Link from 'next/link';
import React, { useState } from 'react';
import { HiOutlineAdjustmentsHorizontal, HiOutlineQrCode } from 'react-icons/hi2';
import { MdAutoGraph, MdDashboardCustomize, MdEvent, MdKeyboardArrowDown } from "react-icons/md";
import { TbClock24 } from "react-icons/tb";


const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center bg-neutral-800/40 p-8 rounded-2xl transform hover:-translate-y-1 transition-all duration-500 border border-neutral-800 hover:border-primary/30 cursor-pointer">
    <div className="feature-icon mb-6 text-[#3B82F6]">
      {icon}
    </div>
    <h3 className="text-3xl font-bold mb-4 text-center">{title}</h3>
    <p className="text-neutral-400 text-center text-lg">{description}</p>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-neutral-800 bg-neutral-900 rounded-md p-6 ">
      <button
        className="flex justify-between items-center w-full text-left text-white text-xl font-semibold focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <MdKeyboardArrowDown className={`w-7 h-7 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <p className="mt-4 text-gray-400 text-lg leading-relaxed animate-fade-in">
          {answer}
        </p>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <>
      <section id="home" className="relative flex items-center justify-center min-h-screen py-32 px-6 text-center mt-[88px] sm:mt-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute w-64 h-64 bg-[#3B82F6] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob top-1/4 left-1/4"></div>
          <div className="absolute w-64 h-64 bg-[#60A5FA] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 top-1/2 right-1/4"></div>
          <div className="absolute w-64 h-64 bg-[#3B82F6] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 bottom-1/4 left-1/3"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 gradient-text animate-fade-in-up">
            Effortless Queue Management for a Seamless Experience
          </h1>
          <p className="text-xl md:text-2xl mb-12 leading-normal text-gray-300 animate-fade-in-up animation-delay-500">
            Q'up empowers businesses, institutes or any organization to eliminate waiting lines, enhance customer satisfaction, and optimize operational flow.
          </p>
          <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-8 justify-center animate-fade-in-up animation-delay-1000">
            <Link href="/signup">
              <Button className="w-full sm:w-auto p-4 px-6 text-lg bg-transparent border-2 border-primary hover:bg-transparent text-primary">Get Started Free</Button>
            </Link>

            <Link href="/login">
              <Button className="w-full sm:w-auto p-4 px-6 text-lg border-2 border-primary">Manage Queues Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-34 px-6 bg-black rounded-t-3xl">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-26 gradient-text">Unleash the Power of Q'up</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureCard
              icon={<MdEvent className="w-16 h-16" />}
              title="Seamless Entrance"
              description="Allow guests/attendees to conveniently schedule appointments and join queues from anywhere, anytime, reducing physical wait lines."
            />
            <FeatureCard
              icon={<TbClock24 className="w-16 h-16" />}
              title="Real-time Updates"
              description="Keep your customers informed with live queue status, estimated wait times, and personalized notifications via web portal."
            />

            <FeatureCard
              icon={<MdDashboardCustomize className="w-16 h-16" />}
              title="Admin Dashboard"
              description="Powerful, intuitive admin panel to manage events, monitor queue flow, and gain real-time insights at your fingertips."
            />
            <FeatureCard
              icon={<HiOutlineAdjustmentsHorizontal className="w-16 h-16" />}
              title="Dynamic Queue Control"
              description="Admins can modify queue positions, prioritize urgent cases, and adjust capacity on the fly — from any device."
            />
            <FeatureCard
              icon={<HiOutlineQrCode className="w-16 h-16" />}
              title="QR Code Integration"
              description="Generate a unique QR code for each event to simplify attendee access — perfect for digital sharing or on-site printing."
            />
            <FeatureCard
              icon={<MdAutoGraph className="w-16 h-16" />}
              title="Analytics & Insights"
              description="Track queue performance, wait times, and user flow to make smarter, data-backed operational decisions."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-34 px-6 bg-neutral-950">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-26 gradient-text">A Simple Path to Efficiency</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="bg-neutral-800/40 rounded-md cursor-pointer p-8 flex flex-col items-center text-center">
              <div className="bg-[#3B82F6] text-white rounded-full h-20 w-20 flex items-center justify-center text-4xl font-bold mb-6 border-4 border-blue-300 shadow-lg">
                1
              </div>
              <h3 className="text-3xl font-semibold mb-4 text-white">Join Queue Easily</h3>
              <p className="text-gray-400 text-lg">
                Customers can join the queue online, via QR code, or joining links with minimal effort.
              </p>
            </div>

            <div className="bg-neutral-800/40 rounded-md cursor-pointer p-8 flex flex-col items-center text-center">
              <div className="bg-[#3B82F6] text-white rounded-full h-20 w-20 flex items-center justify-center text-4xl font-bold mb-6 border-4 border-blue-300 shadow-lg">
                2
              </div>
              <h3 className="text-3xl font-semibold mb-4 text-white">Stay Informed</h3>
              <p className="text-gray-400 text-lg">
                Real-time updates and notifications keep customers aware of their waiting time and turn.
              </p>
            </div>

            <div className="bg-neutral-800/40 rounded-md cursor-pointer p-8 flex flex-col items-center text-center">
              <div className="bg-[#3B82F6] text-white rounded-full h-20 w-20 flex items-center justify-center text-4xl font-bold mb-6 border-4 border-blue-300 shadow-lg">
                3
              </div>
              <h3 className="text-3xl font-semibold mb-4 text-white">Seamless Service</h3>
              <p className="text-gray-400 text-lg">
                Customers are called when ready, ensuring a smooth transition to service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-34 px-6 bg-neutral-920">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold mb-26 gradient-text text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem
              question="What kind of businesses can use Q'up?"
              answer="Q'up is designed to be versatile and can be used by a wide range of businesses including healthcare clinics, retail stores, government offices, service centers, educational institutions, and event organizers – essentially any business with customer queues."
            />
            <FAQItem
              question="How does Q'up handle real-time updates?"
              answer="Q'up is powered by a real-time infrastructure that ensures instant queue updates for both admins and attendees, keeping everyone informed and reducing wait-related confusion."
            />

            <FAQItem
              question="Can I manage multiple events at once?"
              answer="Yes, the admin dashboard allows you to create and manage multiple events simultaneously. Each event has its own unique queue, settings, and QR code for easy access."
            />
            <FAQItem
              question="Is there a way to reorder or prioritize people in the queue?"
              answer="Absolutely. Admins have full control over the queue and can manually reorder attendees, prioritize urgent entries, or remove people as needed—all in real time."
            />
            <FAQItem
              question="Do attendees need to install an app?"
              answer="No. Q'up is completely web-based. Attendees can join queues, check their status, and receive updates through a simple browser link—no app install required."
            />
            <FAQItem
              question="How do I share an event with attendees?"
              answer="Each event comes with a unique QR code and web link that can be printed, emailed, or shared digitally. Scanning the QR code brings attendees directly to that event’s check-in page."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section - Bottom */}
      <section className="py-20 px-6 bg-neutral-950 text-center rounded-t-3xl">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-bold mb-10 leading-tight">
            Experience the Future of Queue Management.
          </h2>
          <p className="text-xl sm:text-2xl text-neutral-400 mb-12 max-w-2xl mx-auto">
            Streamline your operations, delight your customers, and grow your business with Q'up.
          </p>

          <Link href="/signup">
            <Button className="px-8 mx-auto py-4 text-xl">
              Get Started with Q'up
            </Button>
          </Link>
        </div>
      </section>

      {/* Custom Tailwind CSS classes */}
      <style>
        {`
                .gradient-text {
                    background: linear-gradient(90deg, #3B82F6, #60A5FA);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 10px;
                }
                ::-webkit-scrollbar-track {
                    background: #2a2a2a;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #555;
                    border-radius: 10px;
                    border: 2px solid #2a2a2a;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #777;
                }

                /* Keyframe Animations */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(50px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.02); opacity: 0.95; }
                }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(100px, -50px) scale(1.1); }
                    66% { transform: translate(-100px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }

                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
                .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
                .animate-pulse { animation: pulse 2s infinite ease-in-out; }
                .animate-blob { animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.2, 1); }
            `}
      </style>
    </>
  );
};

export default Home;
