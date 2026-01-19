"use client";

import { LayoutGrid, Plus, Settings, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { id: "generate", icon: Plus, label: "Generate" },
    { id: "gallery", icon: LayoutGrid, label: "Gallery" },
    { id: "workflow", icon: History, label: "Workflow" },
    { id: "config", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 lg:pb-8">
      <div className="mx-auto max-w-lg glass rounded-full px-4 py-3 flex items-center justify-between shadow-2xl shadow-black/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 transition-all duration-300",
                isActive ? "text-accent" : "text-foreground/40 hover:text-foreground/70"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-accent/20 blur-xl rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={24} className={cn("transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] font-medium mt-1 uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
