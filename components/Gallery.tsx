"use client";

import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Trash2, Maximize2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Gallery() {
  const gallery = useStore((state) => state.gallery);
  const setCurrentImage = useStore((state) => state.setCurrentImage);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-4xl font-bold tracking-tighter uppercase italic text-secondary">
          Archives
        </h1>
        <p className="text-foreground/40 text-sm font-medium tracking-wide uppercase">
          Your visual legacy ({gallery.length} items)
        </p>
      </header>

      {gallery.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center gap-4">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-foreground flex items-center justify-center">
            <Maximize2 size={32} />
          </div>
          <p className="font-display font-bold uppercase italic tracking-tighter text-xl">
            Silence in the archives
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 pb-24">
          {gallery.map((img, index) => (

            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedImage(img.url)}
              className="relative aspect-[2/3] rounded-2xl overflow-hidden glass group cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-[10px] text-white/70 line-clamp-2 uppercase tracking-tight font-medium">
                  {img.prompt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center"
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
                <button
                  onClick={() => {
                    setCurrentImage(selectedImage);
                    setSelectedImage(null); // Optional: close gallery to go to generate
                  }}
                  className="neo-button bg-accent text-black h-14 px-8 rounded-2xl font-display font-black uppercase italic tracking-tighter flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
                >
                  Use as Base
                </button>
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
}
