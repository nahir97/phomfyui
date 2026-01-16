"use client";

import { useStore } from "@/lib/store";
import { Server, ShieldCheck, Database, RefreshCw } from "lucide-react";

export function Settings() {
  const { serverUrl, setServerUrl, clientId } = useStore();

  return (
    <div className="flex flex-col gap-8 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-4xl font-bold tracking-tighter uppercase italic text-foreground">
          Control
        </h1>
        <p className="text-foreground/40 text-sm font-medium tracking-wide uppercase">
          System configurations
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 flex items-center gap-2">
            <Server size={12} /> ComfyUI Server Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value.replace(/\s/g, ''))}
              className="w-full bg-surface border-2 border-white/5 rounded-2xl p-4 font-medium focus:outline-none focus:border-accent/50 transition-colors"
              placeholder="http://192.168.1.x:8188"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <ShieldCheck className="text-accent" size={20} />
            </div>
          </div>
          <p className="text-[10px] text-foreground/20 italic">
            Example: http://192.168.1.50:8188
          </p>
        </div>

        <div className="glass rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-display font-bold uppercase italic tracking-tighter text-lg">
                Instance ID
              </h3>
              <p className="text-[10px] text-foreground/40 font-mono uppercase">
                {clientId}
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <Database size={20} className="text-accent/40" />
            </div>
          </div>
          
          <div className="h-px bg-white/5 w-full" />
          
          <button className="flex items-center justify-between group">
            <div className="flex flex-col items-start">
              <h3 className="font-display font-bold uppercase italic tracking-tighter text-lg group-hover:text-accent transition-colors">
                Clear Archives
              </h3>
              <p className="text-[10px] text-foreground/40 uppercase">
                Wipe all local gallery data
              </p>
            </div>
            <RefreshCw size={20} className="text-foreground/20 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/20">
            ComfyPhone v0.1.0 • Built for the home network
          </p>
        </div>
      </section>
    </div>
  );
}
