"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchSearchResults as fetchSearchResultsThunk,
  fetchCategory,
  clearError,
  clearResults,
  setFilters,
  clearFilters,
  setQuery,
} from "../slice/searchSlice";

export const useSearch = () => {
  const dispatch = useDispatch();
  const {
    query,
    results,
    loading,
    error,
    filters,
    category,
    categoryLoading,
    categoryError,
  } = useSelector((state) => state.search);

  const fetchSearchResults = ({ query: newQuery, page = 1 } = {}) =>
    dispatch(fetchSearchResultsThunk({ query: newQuery, page })).unwrap();

  const getCategory = () => dispatch(fetchCategory()).unwrap();

  const clearSearchError = () => dispatch(clearError());
  const resetResults = () => dispatch(clearResults());

  const applyFilters = (newFilters) => dispatch(setFilters(newFilters));
  const resetFilters = () => dispatch(clearFilters());

  const updateQuery = (newQuery) => dispatch(setQuery(newQuery));

  return {
    query,
    results,
    loading,
    error,
    filters,
    category,
    categoryLoading,
    categoryError,

    fetchSearchResults,
    getCategory,
    clearSearchError,
    resetResults,
    applyFilters,
    resetFilters,
    updateQuery,
  };
};
