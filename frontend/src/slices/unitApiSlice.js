import { UNIT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const unitApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUnits: builder.query({
      query: () => `${UNIT_URL}`,
      providesTags: ["Units"],
    }),
    getUnitById: builder.query({
      query: (id) => ({
        url: `${UNIT_URL}/${id}`,
      }),
    }),
    createUnit: builder.mutation({
      query: (body) => ({
        url: `${UNIT_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Units"],
    }),
    uploadUnitImage: builder.mutation({
      query: (data) => ({
        url: `${UNIT_URL}/u`,
        method: "POST",
        body: data,
      }),
    }),
    updateUnit: builder.mutation({
      query: (data) => ({
        url: `${UNIT_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `${UNIT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Units"],
    }),
  }),
});

export const {
  useGetAllUnitsQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUploadUnitImageMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApiSlice;
