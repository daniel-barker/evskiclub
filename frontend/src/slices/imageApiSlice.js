import { IMAGES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const imageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `${IMAGES_URL}`,
        method: "POST",
        body: formData,
      }),
    }),
    getImages: builder.query({
      query: () => `${IMAGES_URL}`,
    }),
    getSingleImage: builder.query({
      query: (id) => `${IMAGES_URL}/${id}`,
    }),
    getImageTags: builder.query({
      query: () => `${IMAGES_URL}/tags`,
    }),
    getImagesByTag: builder.query({
      query: (tag) => `${IMAGES_URL}/tags/${tag}`,
    }),
    updateImage: builder.mutation({
      query: (data) => ({
        url: `${IMAGES_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteImage: builder.mutation({
      query: (id) => ({
        url: `${IMAGES_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadImageMutation,
  useGetImagesQuery,
  useGetSingleImageQuery,
  useUpdateImageMutation,
  useGetImageTagsQuery,
  useGetImagesByTagQuery,
  useDeleteImageMutation,
} = imageApiSlice;
