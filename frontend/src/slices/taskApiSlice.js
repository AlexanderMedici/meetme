import { apiSlice } from "./apiSlice";
import { TASKS_URL } from "../constants";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params || {}).toString();
        const suffix = query ? `?${query}` : "";
        return `${TASKS_URL}${suffix}`;
      },
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Task", id: _id })),
        { type: "Task", id: "LIST" },
      ],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: TASKS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TASKS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApiSlice;
