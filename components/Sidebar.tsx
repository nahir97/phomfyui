"use client";

import { LayoutGrid, Plus, Settings, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "generate", icon: Plus, label: "Generate" },
    { id: "gallery", icon: LayoutGrid, label: "Gallery" },
    { id: "workflow", icon: History, label: "Workflow" },
    { id: "config", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-24 hidden lg:flex flex-col items-center py-8 border-r border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="flex flex-col gap-8 items-center h-full">
        {/* Logo/Brand could go here */}
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-8">
          <div className="w-6 h-6 bg-accent rounded-sm rotate-45 animate-pulse" />
        </div>

        <div className="flex flex-col gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 group",
                  isActive ? "text-accent bg-accent/5" : "text-foreground/40 hover:text-foreground/70 hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-glow"
                    className="absolute inset-0 bg-accent/10 blur-md rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={24} className={cn("transition-transform", isActive && "scale-110")} />
                <span className="text-[8px] font-black mt-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {tab.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-accent rounded-l-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-auto">
          {/* Bottom actions if any */}
        </div>
      </div>
    </aside>
  );
}
