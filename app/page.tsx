"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Generator } from "@/components/Generator";
import { Gallery } from "@/components/Gallery";
import { Workflow } from "@/components/Workflow";
import { Settings } from "@/components/Settings";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate");
  const setGallery = useStore((state) => state.setGallery);


  useEffect(() => {
    // Initial sync
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setGallery(data))
      .catch(err => console.error("Failed to sync gallery", err));
  }, [setGallery]);

  const renderContent = () => {
    switch (activeTab) {
      case "generate":
        return <Generator />;
      case "gallery":
        return <Gallery />;
      case "workflow":
        return <Workflow />;
      case "config":
        return <Settings />;
      default:
        return <Generator />;
    }
  };

  return (
    <div className="relative min-h-[100dvh]">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
