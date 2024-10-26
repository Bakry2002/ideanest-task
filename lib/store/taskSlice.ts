import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  state: "todo" | "doing" | "done";
  image?: string;
  ownerId: string;
  assignedUsers: string[];
  createdAt: string;
  updatedAt: string;
}

interface TasksState {
  tasks: Task[];
  loadingStates: {
    create: boolean;
    update: Record<string, boolean>;
    delete: Record<string, boolean>;
  };
}

const initialState: TasksState = {
  tasks: [],
  loadingStates: {
    create: false,
    update: {},
    delete: {},
  },
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setCreateLoading: (state, action: PayloadAction<boolean>) => {
      state.loadingStates = {
        ...state.loadingStates,
        create: action.payload,
      };
    },
    setUpdateLoading: (
      state,
      action: PayloadAction<{ id: string; loading: boolean }>
    ) => {
      state.loadingStates.update[action.payload.id] = action.payload.loading;
    },
    setDeleteLoading: (
      state,
      action: PayloadAction<{ id: string; loading: boolean }>
    ) => {
      state.loadingStates.delete[action.payload.id] = action.payload.loading;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift({
        ...action.payload,
        assignedUsers: action.payload.assignedUsers || [],
      });
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = {
          ...action.payload,
          assignedUsers: action.payload.assignedUsers || [],
          updatedAt: new Date().toISOString(),
        };
      }
    },
    // This is mainly for optimistic updates when dragging and dropping tasks in the Kanban board
    optimisticUpdateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = {
          ...action.payload,
          assignedUsers: action.payload.assignedUsers || [],
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      delete state.loadingStates.update[action.payload];
      delete state.loadingStates.delete[action.payload];
    },
  },
});

export const {
  addTask,
  updateTask,
  optimisticUpdateTask,
  deleteTask,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
} = tasksSlice.actions;

export default tasksSlice.reducer;
