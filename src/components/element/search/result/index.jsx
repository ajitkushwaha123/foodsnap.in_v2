"use client";

import React from "react";
import { useSearch } from "@/store/hooks/useSearch";
import ImageCard from "../card";
import { SkeletonCard } from "@/components/global/skeleton/card";

const SearchResult = () => {
  const { results, loading } = useSearch();

  if (loading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );


  if (!results?.length) return <p className="p-4">No results found.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-4">
      {results.map((result) => (
        <ImageCard
          key={result._id?.$oid || result._id}
          image={result.image_url}
          title={result.title}
          onDownload={() => {
            console.log("download clicked for", result.title);
          }}
        />
      ))}
    </div>
  );
};

export default SearchResult;
