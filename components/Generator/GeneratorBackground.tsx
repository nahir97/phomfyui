"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Loader2, X, Download } from "lucide-react";
import { useStore } from "@/lib/store";

export const GeneratorBackground = memo(function GeneratorBackground() {
  const currentImage = useStore((state) => state.currentImage);
  const isGenerating = useStore((state) => state.isGenerating);
  const progress = useStore((state) => state.progress);
  const sessionImages = useStore((state) => state.sessionImages);
  const queueSize = useStore((state) => state.queueSize);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Derive placeholders needed. 
  // We cap it so it doesn't try to render negative placeholders if queueSize goes wonky.
  const placeholdersCount = Math.max(0, queueSize - sessionImages.length);

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
              className="absolute inset-0 opacity-30 blur-[100px] scale-110 pointer-events-none"
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Main Image - Centered and contained */}
            <div className="absolute inset-0 flex items-start justify-center pt-0 px-0 pointer-events-none">
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
          <div className="absolute inset-0 flex items-center justify-center text-foreground/10 pointer-events-none">
            <ImageIcon size={120} strokeWidth={0.5} />
          </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-start p-8 pt-[max(env(safe-area-inset-top),4rem)] overflow-y-auto no-scrollbar pointer-events-auto"
          >
            <div className="w-full max-w-4xl flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <Loader2 className="text-accent animate-spin shrink-0" size={40} />
                <div className="flex flex-col">
                  <p className="font-display text-2xl md:text-3xl font-bold uppercase italic tracking-tighter text-accent">
                    Generating {sessionImages.length} / {queueSize}
                  </p>
                  <p className="text-sm font-medium tracking-widest text-white/50">{Math.round(progress)}% Current</p>
                </div>
              </div>
              
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-10 overflow-hidden shrink-0">
                <motion.div
                  className="h-full bg-accent shadow-[0_0_20px_var(--color-accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full pb-32">
                <AnimatePresence>
                  {sessionImages.map((img) => (
                    <motion.div 
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="aspect-[2/3] rounded-2xl overflow-hidden glass relative group cursor-pointer"
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <img src={img.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </motion.div>
                  ))}
                  {Array.from({ length: placeholdersCount }).map((_, i) => (
                    <motion.div 
                      key={`placeholder-${i}`} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="aspect-[2/3] rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center bg-white/5/50 backdrop-blur-sm"
                    >
                      {i === 0 ? (
                        <Loader2 className="animate-spin text-white/20" size={32} />
                      ) : (
                        <ImageIcon className="text-white/10" size={32} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Blurred Background */}
            <div
              className="absolute inset-0 opacity-20 blur-[100px] scale-125 pointer-events-none"
              style={{
                backgroundImage: `url(${selectedImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-20 p-3 glass rounded-full text-foreground hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              <X size={24} />
            </button>

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 pb-32">
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={selectedImage}
                className="w-full h-full object-contain max-h-[70vh] drop-shadow-2xl"
              />

              <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-4 px-6 pointer-events-auto">
                <a
                  href={selectedImage}
                  download
                  className="h-14 w-14 glass rounded-2xl text-foreground flex items-center justify-center hover:bg-white/10 hover:text-accent transition-all active:scale-95 border border-white/10"
                >
                  <Download size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
