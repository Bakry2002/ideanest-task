import * as yup from "yup";

export const taskSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high"], "Invalid priority")
    .required("Priority is required"),
  state: yup
    .string()
    .oneOf(["todo", "doing", "done"], "Invalid state")
    .required("State is required"),
  image: yup.string().url("Must be a valid URL").optional(),
});
