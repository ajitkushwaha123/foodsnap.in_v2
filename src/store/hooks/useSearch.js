"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchSearchResults as fetchSearchResultsThunk,
  clearError,
} from "../slice/searchSlice";

export const useSearch = () => {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.search);

  const fetchSearchResults = (query) =>
    dispatch(fetchSearchResultsThunk(query)).unwrap();

  const clearSearchError = () => dispatch(clearError());

  return {
    results,
    loading,
    error,
    fetchSearchResults,
    clearSearchError,
  };
};
