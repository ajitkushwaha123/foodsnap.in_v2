"use client";

import React from "react";
import { Download, Heart, Eye, Star } from "lucide-react";

export default function ImageCard({ image, title, onDownload }) {
  return (
    <div
      className="group relative overflow-hidden rounded-md bg-muted/40 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
      role="article"
    >
      <div className="w-full p-2 aspect-[4/3] relative">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload?.();
          }}
          className="absolute cursor-pointer top-3 right-3 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 group-hover:scale-105"
        >
          <Download className="h-4 w-4 text-gray-800" />
        </button>
      </div>

      <div className="p-3 space-y-2 bg-background">
        <div>
          <h3 className="text-sm font-semibold line-clamp-1">{title}</h3>
        </div>
      </div>
    </div>
  );
}
