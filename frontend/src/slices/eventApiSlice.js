import { EVENT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: () => `${EVENT_URL}`,
      providesTags: ["Events"],
    }),
    getSingleEvent: builder.query({
      query: (id) => ({
        url: `${EVENT_URL}/${id}`,
      }),
    }),
    createEvent: builder.mutation({
      query: (body) => ({
        url: `${EVENT_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Events"],
    }),
    updateEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `${EVENT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetSingleEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApiSlice;
