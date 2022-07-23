import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchCommentsByPostId = createAsyncThunk(
  "comments/fetchCommentsByPostId",
  async (id) => {
    const { data } = await axios.get(`/comments/${id}`);
    return data;
  }
);
export const fetchAllComments = createAsyncThunk(
  "comments/fetchAllComments",
  async (id) => {
    const { data } = await axios.get(`/comments`);
    return data.slice(0, 5);
  }
);

const initialState = {
  comments: [],
  topComments: [],
  status: "loading",
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCommentsByPostId.pending]: (state) => {
      state.status = "loading";
    },
    [fetchCommentsByPostId.fulfilled]: (state, action) => {
      state.comments = action.payload;
      state.status = "loaded";
    },
    [fetchCommentsByPostId.rejected]: (state) => {
      state.comments = [];
      state.status = "error";
    },
    [fetchAllComments.fulfilled]: (state, action) => {
      state.topComments = action.payload;
    },
  },
});

export const commentsReducer = commentsSlice.reducer;
