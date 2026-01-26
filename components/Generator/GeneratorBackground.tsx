"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";

export const GeneratorBackground = memo(function GeneratorBackground() {
  const currentImage = useStore((state) => state.currentImage);
  const isGenerating = useStore((state) => state.isGenerating);
  const progress = useStore((state) => state.progress);
  return (
    <div className="absolute inset-0 z-0 bg-background/50">
      <AnimatePresence mode="wait">
        {currentImage ? (
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Blurred background for atmosphere */}
            <div
              className="absolute inset-0 opacity-30 blur-[100px] scale-110"
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Main Image - Centered and contained */}
            <div className="absolute inset-0 flex items-start justify-center pt-0 px-0">
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={currentImage}
                alt="Generated"
                className="w-full h-full object-contain object-top max-h-screen drop-shadow-2xl"
              />
            </div>

          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/10">
            <ImageIcon size={120} strokeWidth={0.5} />
          </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8">
          <Loader2 className="text-accent animate-spin mb-6" size={64} />
          <div className="flex flex-col items-center gap-2">
            <p className="font-display text-3xl font-bold uppercase italic tracking-tighter text-accent">
              Creating
            </p>
            <p className="text-sm font-medium tracking-widest text-white/50">{Math.round(progress)}%</p>
          </div>
          <div className="w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
            <motion.div
              className="h-full bg-accent shadow-[0_0_20px_var(--color-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
});
