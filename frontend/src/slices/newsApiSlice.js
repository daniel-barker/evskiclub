import { NEWS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const newsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNews: builder.query({
      query: () => `${NEWS_URL}/all`,
      keepUnusedDataFor: 5,
      providesTags: ["News"],
    }),
    getPublishedNews: builder.query({
      query: () => `${NEWS_URL}`,
      keepUnusedDataFor: 5,
      providesTags: ["News"],
    }),
    getNewsById: builder.query({
      query: (id) => ({
        url: `${NEWS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getLatestNews: builder.query({
      query: () => `${NEWS_URL}/latest`,
      keepUnusedDataFor: 5,
      providesTags: ["News"],
    }),
    createNews: builder.mutation({
      query: (body) => ({
        url: `${NEWS_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["News"],
    }),
    updateNews: builder.mutation({
      query: (data) => ({
        url: `${NEWS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["News"],
    }),
    deleteNews: builder.mutation({
      query: (id) => ({
        url: `${NEWS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    uploadNewsImage: builder.mutation({
      query: (data) => ({
        url: `${NEWS_URL}/u`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllNewsQuery,
  useGetPublishedNewsQuery,
  useGetNewsByIdQuery,
  useGetLatestNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useUploadNewsImageMutation,
} = newsApiSlice;
