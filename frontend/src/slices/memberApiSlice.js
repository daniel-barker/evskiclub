import { MEMBERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const membersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMembers: builder.query({
      query: () => `${MEMBERS_URL}`,
      keepUnusedDataFor: 5,
      providesTags: ["Member"],
    }),
    getMemberById: builder.query({
      query: (id) => ({
        url: `${MEMBERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createMember: builder.mutation({
      query: (body) => ({
        url: `${MEMBERS_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Member"],
    }),
    updateMember: builder.mutation({
      query: (data) => ({
        url: `${MEMBERS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Member"],
    }),
    deleteMember: builder.mutation({
      query: (id) => ({
        url: `${MEMBERS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllMembersQuery,
  useGetMemberByIdQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = membersApiSlice;
