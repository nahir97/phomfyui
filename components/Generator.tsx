"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useStore } from "@/lib/store";
import { queuePrompt, createWebSocket, getImageUrl, workflowTemplate } from "@/lib/comfy";
import { GeneratorBackground } from "@/components/Generator/GeneratorBackground";
import { GeneratorInput } from "@/components/Generator/GeneratorInput";

export function Generator() {
  const serverUrl = useStore((state) => state.serverUrl);
  const clientId = useStore((state) => state.clientId);
  const prompt = useStore((state) => state.prompt);
  const setPrompt = useStore((state) => state.setPrompt);
  const isGenerating = useStore((state) => state.isGenerating);
  const setIsGenerating = useStore((state) => state.setIsGenerating);
  const setProgress = useStore((state) => state.setProgress);
  const addToGallery = useStore((state) => state.addToGallery);
  const promptHistory = useStore((state) => state.promptHistory);
  const setPromptHistory = useStore((state) => state.setPromptHistory);
  const addPromptToHistory = useStore((state) => state.addPromptToHistory);
  const setCurrentImage = useStore((state) => state.setCurrentImage);
  const selectedModel = useStore((state) => state.selectedModel);
  const selectedSampler = useStore((state) => state.selectedSampler);
  const selectedScheduler = useStore((state) => state.selectedScheduler);
  const customWorkflow = useStore((state) => state.workflow);
  const promptNodeId = useStore((state) => state.promptNodeId);
  const modelNodeId = useStore((state) => state.modelNodeId);
  const seedNodeId = useStore((state) => state.seedNodeId);
  const queueSize = useStore((state) => state.queueSize);
  const setQueueSize = useStore((state) => state.setQueueSize);

  // Initial fetch of history
  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => setPromptHistory(data))
      .catch(err => console.error("Failed to fetch prompt history:", err));
  }, [setPromptHistory]);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for values used in the WebSocket callback to avoid reconnection on every change
  const stateRef = useRef({
    customWorkflow,
    prompt,
    selectedModel,
    selectedSampler,
    selectedScheduler,
    promptNodeId,
    modelNodeId,
    serverUrl
  });

  useEffect(() => {
    stateRef.current = {
      customWorkflow,
      prompt,
      selectedModel,
      selectedSampler,
      selectedScheduler,
      promptNodeId,
      modelNodeId,
      serverUrl
    };
  }, [customWorkflow, prompt, selectedModel, selectedSampler, selectedScheduler, promptNodeId, modelNodeId, serverUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = createWebSocket(serverUrl, clientId, (data) => {
      console.log("WS Message:", data);
      
      if (data.type === "progress") {
        const p = (data.data.value / data.data.max) * 100;
        setProgress(p);
      }
      
      if (data.type === "status" && data.data?.status?.exec_info) {
        if (data.data.status.exec_info.queue_remaining === 0) {
          setIsGenerating(false);
          setProgress(0);
        } else {
          setIsGenerating(true);
        }
      }

      if (data.type === "executing" && data.data.node === null) {
        setProgress(0);
      }

      if (data.type === "executed") {
        if (data.data.output.images) {
          const img = data.data.output.images[0];
          const url = getImageUrl(stateRef.current.serverUrl, img.filename, img.subfolder, img.type);
          
          const finalWorkflow = JSON.parse(JSON.stringify(stateRef.current.customWorkflow || workflowTemplate));
          if (finalWorkflow[stateRef.current.promptNodeId]) {
            finalWorkflow[stateRef.current.promptNodeId].inputs.text = stateRef.current.prompt;
          }
          if (finalWorkflow[stateRef.current.modelNodeId]) {
            finalWorkflow[stateRef.current.modelNodeId].inputs.ckpt_name = stateRef.current.selectedModel;
          }
          
          // Update sampler and scheduler in finalWorkflow for history
          for (const nodeId in finalWorkflow) {
            const node = finalWorkflow[nodeId];
            if (node.inputs) {
              if (stateRef.current.selectedSampler && node.inputs.sampler_name !== undefined) {
                node.inputs.sampler_name = stateRef.current.selectedSampler;
              }
              if (stateRef.current.selectedScheduler && node.inputs.scheduler !== undefined) {
                node.inputs.scheduler = stateRef.current.selectedScheduler;
              }
            }
          }

          addToGallery({
            id: uuidv4(),
            url,
            prompt: stateRef.current.prompt,
            timestamp: Date.now(),
            workflow: finalWorkflow
          });

          setCurrentImage(url);
          setProgress(0);
        }
      }
    });

    socket.onerror = () => setError("WebSocket connection failed. Check Server URL.");
    socket.onopen = () => setError(null);
    
    setWs(socket);

    return () => socket.close();
  }, [serverUrl, clientId]);

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return;
    
    setError(null);
    setIsGenerating(true);
    setProgress(0);

    try {
      for (let i = 0; i < queueSize; i++) {
        await queuePrompt(serverUrl, clientId, prompt, selectedModel, customWorkflow, {
          promptNodeId,
          modelNodeId,
          seedNodeId,
          sampler: selectedSampler,
          scheduler: selectedScheduler
        });
      }

      // Task PROMPT-002: Save prompt to history
      const promptItem = { 
        id: uuidv4(),
        text: prompt, 
        timestamp: Date.now() 
      };
      
      addPromptToHistory(promptItem);

      fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptItem),
      }).catch(err => console.error("Failed to save prompt:", err));

    } catch (err) {
      setError("Failed to queue prompt. Is ComfyUI running?");
      setIsGenerating(false);
    }
  }, [isGenerating, queueSize, serverUrl, clientId, prompt, selectedModel, customWorkflow, promptNodeId, modelNodeId, seedNodeId, selectedSampler, selectedScheduler, setProgress, setIsGenerating, addPromptToHistory]);


  return (
    <div className="h-[100dvh] w-full flex flex-col relative overflow-hidden">
      <GeneratorBackground />
      
      <GeneratorInput
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        promptHistory={promptHistory}
        setPromptHistory={setPromptHistory}
        error={error}
        queueSize={queueSize}
        setQueueSize={setQueueSize}
      />
    </div>
  );
}
