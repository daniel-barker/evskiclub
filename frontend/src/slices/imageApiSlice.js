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
    getImageTags: builder.query({
      query: () => `${IMAGES_URL}/tags`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadImageMutation,
  useGetImagesQuery,
  useGetImageTagsQuery,
} = imageApiSlice;
