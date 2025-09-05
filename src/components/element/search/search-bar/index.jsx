"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X } from "lucide-react";
import { useSearch } from "@/store/hooks/useSearch";

export default function SearchBar({ placeholder = "Search..." }) {
  const [query, setQuery] = useState("");

  const { fetchSearchResults, loading, clearSearchError } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchSearchResults(query);
  };

  const clearSearch = () => {
    setQuery("");
    clearSearchError();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-sm border bg-background p-2 shadow-sm"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />

        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-10 h-10 rounded-sm"
        />

        {query && !loading && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search button */}
      <Button
        type="submit"
        disabled={loading}
        className="h-10 px-4 rounded-sm flex items-center gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span>{loading ? "Searching..." : "Search"}</span>
      </Button>
    </form>
  );
}
