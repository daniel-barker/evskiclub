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
      invalidatesTags: ["Images", "Tags"],
    }),

    getImages: builder.query({
      query: () => `${IMAGES_URL}`,
      providesTags: ["Images"],
    }),
    getSingleImage: builder.query({
      query: (id) => `${IMAGES_URL}/${id}`,
    }),
    getImageTags: builder.query({
      query: () => `${IMAGES_URL}/tags`,
      providesTags: ["Tags"],
    }),
    getImagesByTag: builder.query({
      query: (tag) => `${IMAGES_URL}/tags/${tag}`,
    }),
    getCarouselImages: builder.query({
      query: () => `${IMAGES_URL}/carousel`,
    }),
    updateImage: builder.mutation({
      query: (data) => ({
        url: `${IMAGES_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Images", "Tags"],
    }),
    deleteImage: builder.mutation({
      query: (id) => ({
        url: `${IMAGES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Images", "Tags"],
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
  useGetCarouselImagesQuery,
  useDeleteImageMutation,
} = imageApiSlice;
