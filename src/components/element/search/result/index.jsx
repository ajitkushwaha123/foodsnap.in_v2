"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useSearch } from "@/store/hooks/useSearch";
import ImageCard from "../card";
import { SkeletonCard } from "@/components/global/skeleton/card";

const SearchResult = () => {
  const { results, loading, fetchSearchResults } = useSearch();

  const observer = useRef(null);

  const lastResultRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && results?.pagination?.hasNextPage) {
          fetchSearchResults({ page: results.pagination.page + 1 });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, results?.pagination, fetchSearchResults]
  );

  if (loading && !results?.data?.length) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!results?.data?.length) {
    return <p className="p-4">No results found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-4">
      {results.data.map((result, index) => {
        if (index === results.data.length - 1) {
          return (
            <div ref={lastResultRef} key={result._id?.$oid || result._id}>
              <ImageCard image={result} />
            </div>
          );
        } else {
          return (
            <ImageCard key={result._id?.$oid || result._id} image={result} />
          );
        }
      })}

      {loading &&
        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
};

export default SearchResult;
