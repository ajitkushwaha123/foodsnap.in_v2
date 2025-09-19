import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async ({ query, page = 1 }, { getState, rejectWithValue }) => {
    try {
      const { search } = getState();
      const filters = search.filters || {};
      // fallback to last query from state if not explicitly passed
      const activeQuery = query ?? search.query;

      const res = await axios.get(
        `/api/search?query=${encodeURIComponent(
          activeQuery
        )}&page=${page}&${new URLSearchParams(filters)}`
      );

      return { data: res.data, page, query: activeQuery };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Search failed"
      );
    }
  }
);

export const fetchCategory = createAsyncThunk(
  "search/fetchCategory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/search/filter/category`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Fetch category failed"
      );
    }
  }
);

const initialState = {
  query: "",
  results: { data: [], pagination: {} },
  loading: false,
  error: null,
  filters: {},
  category: [],
  categoryLoading: false,
  categoryError: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.categoryError = null;
    },
    clearResults: (state) => {
      state.results = { data: [], pagination: {} };
      state.query = "";
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        const { data, page, query } = action.payload;
        state.loading = false;
        state.query = query; // always persist latest query in state

        if (page === 1) {
          // New search → replace results
          state.results = data;
        } else {
          // Pagination → append results
          state.results = {
            ...data,
            data: [...state.results.data, ...data.data],
          };
        }
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.error = action.payload || "Search failed";
        state.loading = false;
        if (!state.results.data?.length) {
          state.results = { data: [], pagination: {} };
        }
      })

      .addCase(fetchCategory.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.category = action.payload;
        state.categoryLoading = false;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.categoryError = action.payload || "Fetch category failed";
        state.category = [];
        state.categoryLoading = false;
      });
  },
});

export const {
  clearError,
  clearResults,
  setFilters,
  clearFilters,
  setQuery,
} = searchSlice.actions;

export const selectSearchQuery = (state) => state.search.query;
export const selectSearchResults = (state) => state.search.results;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchError = (state) => state.search.error;
export const selectSearchFilters = (state) => state.search.filters;

export const selectCategory = (state) => state.search.category;
export const selectCategoryLoading = (state) => state.search.categoryLoading;
export const selectCategoryError = (state) => state.search.categoryError;

export default searchSlice.reducer;
