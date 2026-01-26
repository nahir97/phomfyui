"use client";

import { workflowTemplate } from "@/lib/comfy";
import { Layers, Zap, Box, Activity } from "lucide-react";
import { useStore } from "@/lib/store";

export function Workflow() {
  const selectedModel = useStore((state) => state.selectedModel);
  const customWorkflow = useStore((state) => state.workflow);
  const modelNodeId = useStore((state) => state.modelNodeId);
  const workflow = customWorkflow || workflowTemplate;
  const nodes = Object.entries(workflow);


  return (
    <div className="flex flex-col gap-8 p-6 pt-[calc(1.5rem+env(safe-area-inset-top))]">

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-24">
        {nodes.map(([id, node]: [string, any]) => (
          <div 
            key={id}
            className="glass rounded-2xl p-4 flex items-center justify-between group hover:border-accent-secondary/30 transition-colors h-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-secondary/40 group-hover:text-accent-secondary transition-colors">
                {node.class_type.includes("Sampler") ? <Zap size={18} /> : 
                 node.class_type.includes("Loader") ? <Box size={18} /> : 
                 node.class_type.includes("Encode") ? <Activity size={18} /> :
                 <Layers size={18} />}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-tight">
                  {node._meta?.title || node.class_type}
                </h3>
                <p className="text-[10px] text-foreground/40 font-mono">
                  NODE #{id} • {node.class_type}
                  {id === modelNodeId && ` • ${selectedModel}`}
                </p>

              </div>
            </div>

            
            <div className="px-3 py-1 bg-white/5 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 group-hover:text-accent-secondary/60">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
