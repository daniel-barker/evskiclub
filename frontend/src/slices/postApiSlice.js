import { POST_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      query: () => `${POST_URL}`,
      keepUnusedDataFor: 5,
      providesTags: ["Post"],
    }),
    getApprovedPosts: builder.query({
      query: () => `${POST_URL}/approved`,
      keepUnusedDataFor: 5,
      providesTags: ["Post"],
    }),
    getMyPosts: builder.query({
      query: () => `${POST_URL}/mine`,
      keepUnusedDataFor: 5,
      providesTags: ["Post"],
    }),
    getPostById: builder.query({
      query: (id) => ({
        url: `${POST_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Post"],
    }),
    createPost: builder.mutation({
      query: (body) => ({
        url: `${POST_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
    userUpdatePost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/${data._id}/user`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    adminUpdatePost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/${data._id}/admin`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `${POST_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    uploadPostImage: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/u`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetApprovedPostsQuery,
  useGetMyPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUserUpdatePostMutation,
  useAdminUpdatePostMutation,
  useDeletePostMutation,
  useUploadPostImageMutation,
} = postApiSlice;
