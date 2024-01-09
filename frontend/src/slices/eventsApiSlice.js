import { EVENTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPastEvents: builder.query({
      query: () => `${EVENTS_URL}/past`,
      providesTags: ["Event"],
    }),
    getFutureEvents: builder.query({
      query: () => `${EVENTS_URL}/future`,
      keepUnusedDataFor: 5,
      providesTags: ["Event"],
    }),
    getEventById: builder.query({
      query: (id) => ({
        url: `${EVENTS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getAllEvents: builder.query({
      query: () => `${EVENTS_URL}`,
      keepUnusedDataFor: 5,
      providesTags: ["Event"],
    }),
    createEvent: builder.mutation({
      query: (body) => ({
        url: `${EVENTS_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Event"],
    }),
    updateEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENTS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `${EVENTS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    uploadEventImage: builder.mutation({
      query: (data) => ({
        url: `${EVENTS_URL}/u`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPastEventsQuery,
  useGetFutureEventsQuery,
  useGetEventByIdQuery,
  useGetAllEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useUploadEventImageMutation,
} = eventsApiSlice;
