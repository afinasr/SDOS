"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { togglePhotoFavorite } from "../actions";

export default function GalleryGrid({ initialPhotos, projectId }: { initialPhotos: any[], projectId: string }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, currentStatus: boolean) => {
    // Optimistic update
    setPhotos(photos.map(p => p.id === id ? { ...p, is_favorited: !currentStatus } : p));
    
    startTransition(async () => {
      try {
        await togglePhotoFavorite(id, !currentStatus, projectId);
      } catch (e) {
        toast.error("Failed to update favorite status");
        // Revert on error
        setPhotos(photos.map(p => p.id === id ? { ...p, is_favorited: currentStatus } : p));
      }
    });
  };

  return (
    <>
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          onClick={() => handleToggle(photo.id, photo.is_favorited)}
          className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
            photo.is_favorited ? "ring-4 ring-cyan-500 ring-offset-2 ring-offset-black scale-95" : "bg-zinc-800/50 hover:bg-zinc-800"
          }`}
        >
          <img src={photo.url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          
          {photo.is_favorited && (
            <div className="absolute inset-0 bg-cyan-900/20 backdrop-blur-[2px]" />
          )}
          
          <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
            photo.is_favorited ? "bg-cyan-500 text-white scale-100" : "bg-black/50 text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 backdrop-blur-sm"
          }`}>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
      ))}
    </>
  );
}
