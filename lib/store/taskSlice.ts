import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  userId: string; // connect to user
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  state: "todo" | "doing" | "done";
  image?: string;
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
    // selectUserTasks: (state, action: PayloadAction<string>) => {
    //   state.tasks = state.tasks.filter(
    //     (task) => task.userId === action.payload
    //   );
    // },
    // Update addTask to include userId
    // addTask: (state, action: PayloadAction<Task>) => {
    //   if (!action.payload.userId) {
    //     return;
    //   }
    //   state.tasks.push(action.payload);
    // },
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
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    optimisticUpdateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      // Clean up loading states
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
