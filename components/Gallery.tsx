"use client";

import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Trash2, Maximize2, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, memo, useCallback } from "react";
import { cn } from "@/lib/utils";

const GalleryItem = memo(({ img, index, onClick }: { img: any; index: number; onClick: (url: string) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 20) * 0.05 }}
      onClick={() => onClick(img.url)}
      className="relative aspect-[2/3] rounded-2xl overflow-hidden glass group cursor-pointer"
    >
      <img
        src={img.url}
        alt={img.prompt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
        <p className="text-[10px] text-white/70 line-clamp-2 uppercase tracking-tight font-medium">
          {img.prompt}
        </p>
      </div>
    </motion.div>
  );
});

export function Gallery() {
  const gallery = useStore((state) => state.gallery);
  const setGallery = useStore((state) => state.setGallery);
  const setCurrentImage = useStore((state) => state.setCurrentImage);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Pagination / Infinite Scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/gallery?page=${nextPage}&limit=20`);
      const data = await res.json();
      
      if (data.length < 20) {
        setHasMore(false);
      }
      
      if (data.length > 0) {
        setGallery([...gallery, ...data]);
        setPage(nextPage);
      }
    } catch (err) {
      console.error("Failed to fetch more gallery items:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore, gallery, setGallery]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        fetchMore();
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchMore, hasMore, isLoadingMore]);

  const handleImageClick = useCallback((url: string) => {
    setSelectedImage(url);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 pt-[calc(1.5rem+env(safe-area-inset-top))]">
      {gallery.length === 0 && !isLoadingMore ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center gap-4">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-foreground flex items-center justify-center">
            <Maximize2 size={32} />
          </div>
          <p className="font-display font-bold uppercase italic tracking-tighter text-xl">
            Silence in the archives
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {gallery.map((img, index) => (
              <GalleryItem 
                key={img.id} 
                img={img} 
                index={index} 
                onClick={handleImageClick} 
              />
            ))}
          </div>
          
          {/* Load More Sentinel */}
          {hasMore && (
            <div ref={loadMoreRef} className="h-24 w-full flex justify-center items-center opacity-50">
              <Loader2 className="animate-spin text-accent" size={24} />
            </div>
          )}
          
          {/* Spacer for bottom nav */}
          <div className="h-24" />
        </>
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
