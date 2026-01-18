"use client";

import { useStore } from "@/lib/store";
import { Server, ShieldCheck, Database, RefreshCw, Box, Upload, FileJson, Hash } from "lucide-react";
import { getModels } from "@/lib/comfy";
import { useEffect, useState } from "react";

export function Settings() {
  const serverUrl = useStore((state) => state.serverUrl);
  const setServerUrl = useStore((state) => state.setServerUrl);
  const clientId = useStore((state) => state.clientId);
  const models = useStore((state) => state.models);
  const setModels = useStore((state) => state.setModels);
  const selectedModel = useStore((state) => state.selectedModel);
  const setSelectedModel = useStore((state) => state.setSelectedModel);
  
  const workflow = useStore((state) => state.workflow);
  const setWorkflow = useStore((state) => state.setWorkflow);
  const promptNodeId = useStore((state) => state.promptNodeId);
  const setPromptNodeId = useStore((state) => state.setPromptNodeId);
  const modelNodeId = useStore((state) => state.modelNodeId);
  const setModelNodeId = useStore((state) => state.setModelNodeId);
  const seedNodeId = useStore((state) => state.seedNodeId);
  const setSeedNodeId = useStore((state) => state.setSeedNodeId);

  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setWorkflow(json);
        
        // Auto-detect nodes
        const nodes = Object.entries(json);
        
        // Find prompt node (CLIPTextEncode with 'prompt' in title or just first one)
        const promptNode = nodes.find(([_, node]: [string, any]) => 
          node.class_type === "CLIPTextEncode" && 
          (node._meta?.title?.toLowerCase().includes("positive") || !node._meta?.title?.toLowerCase().includes("negative"))
        );
        if (promptNode) setPromptNodeId(promptNode[0]);

        // Find model node
        const modelNode = nodes.find(([_, node]: [string, any]) => 
          node.class_type === "CheckpointLoaderSimple" || node.inputs?.ckpt_name
        );
        if (modelNode) setModelNodeId(modelNode[0]);

        // Find seed node
        const seedNode = nodes.find(([_, node]: [string, any]) => 
          node.class_type.includes("Seed") || node.inputs?.seed !== undefined || node.inputs?.noise_seed !== undefined
        );
        if (seedNode) setSeedNodeId(seedNode[0]);

      } catch (err) {
        console.error("Failed to parse workflow JSON", err);
        alert("Invalid JSON workflow file");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const fetchModels = async () => {
      // Validate serverUrl before fetching to avoid spamming bad requests
      if (!serverUrl || !serverUrl.startsWith('http')) return;
      
      setIsLoadingModels(true);
      try {
        const fetchedModels = await getModels(serverUrl);
        // Only update if the models have actually changed to avoid unnecessary re-renders
        if (JSON.stringify(fetchedModels) !== JSON.stringify(models)) {
          setModels(fetchedModels);
        }
      } catch (error) {
        console.error("Failed to fetch models", error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, [serverUrl, setModels]);

  return (

    <div className="flex flex-col gap-8 p-6 pb-24">
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

        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 flex items-center gap-2">
            <FileJson size={12} /> Workflow Configuration
          </label>
          
          <div className="glass rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-tight">
                  {workflow ? "Custom Workflow Active" : "Default Workflow"}
                </span>
                <span className="text-[10px] text-foreground/40 font-mono">
                  {workflow ? `${Object.keys(workflow).length} Nodes Detected` : "comfy.ts template"}
                </span>
              </div>
              <label className="cursor-pointer bg-accent text-black px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                <Upload size={14} />
                Import JSON
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            
            <p className="text-[9px] text-foreground/30 italic">
              Note: You must export your workflow from ComfyUI as "API Format" (requires Dev mode enabled in ComfyUI settings).
            </p>

            {workflow && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-foreground/40 ml-1">Prompt Node ID</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={promptNodeId} 
                      onChange={(e) => setPromptNodeId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-accent/50"
                    />
                    <Hash size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/20" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-foreground/40 ml-1">Model Node ID</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={modelNodeId} 
                      onChange={(e) => setModelNodeId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-accent/50"
                    />
                    <Hash size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/20" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-foreground/40 ml-1">Seed Node ID</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={seedNodeId} 
                      onChange={(e) => setSeedNodeId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-accent/50"
                    />
                    <Hash size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/20" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 justify-end">
                  <button 
                    onClick={() => {
                      setWorkflow(null);
                      setPromptNodeId("6");
                      setModelNodeId("4");
                      setSeedNodeId("15");
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-[8px] font-black uppercase tracking-widest text-red-400/60 hover:bg-red-500/10 transition-colors"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1 flex items-center gap-2">
            <Box size={12} /> Active Checkpoint
          </label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/5 rounded-2xl p-4 pr-12 font-medium text-foreground focus:outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer [color-scheme:dark]"
              disabled={isLoadingModels || models.length === 0}
            >
              {models.length === 0 ? (
                <option value={selectedModel} className="bg-background text-foreground">{selectedModel}</option>
              ) : (
                models.map((model) => (
                  <option key={model} value={model} className="bg-background text-foreground">
                    {model}
                  </option>
                ))
              )}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              {isLoadingModels ? (
                <RefreshCw className="text-accent animate-spin" size={20} />
              ) : (
                <Box className="text-accent/40" size={20} />
              )}
            </div>
          </div>
          <p className="text-[10px] text-foreground/20 italic">
            Select the model for generation
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
