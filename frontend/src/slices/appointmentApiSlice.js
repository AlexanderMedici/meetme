import { apiSlice } from "./apiSlice";
import { APPOINTMENTS_URL } from "../constants";

export const appointmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params || {}).toString();
        const suffix = query ? `?${query}` : "";
        return `${APPOINTMENTS_URL}${suffix}`;
      },
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Appointment", id: _id })),
        { type: "Appointment", id: "LIST" },
      ],
      keepUnusedDataFor: 5,
    }),
    createAppointment: builder.mutation({
      query: (data) => ({
        url: APPOINTMENTS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Appointment", id: "LIST" }],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${APPOINTMENTS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointment", id },
        { type: "Appointment", id: "LIST" },
      ],
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `${APPOINTMENTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Appointment", id },
        { type: "Appointment", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentApiSlice;
