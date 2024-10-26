"use client";

import KanbanBoard from "@/components/kanban-board";
import { TaskCard } from "@/components/task-card";
import { TaskFilters } from "@/components/task-filters";
import { TaskForm } from "@/components/task-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ViewToggle } from "@/components/view-toggle";
import { RootState } from "@/lib/store/store";
import {
  addTask,
  deleteTask,
  optimisticUpdateTask,
  setCreateLoading,
  setDeleteLoading,
  setUpdateLoading,
  Task,
  updateTask,
} from "@/lib/store/taskSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const SIMULATED_DELAY = 500;

export default function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useKindeAuth();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const userProfile = useSelector((state: RootState) => state.user.profile);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<"grid" | "kanban">("grid");

  const simulateServerOperation = async (
    operation: () => void,
    loadingAction: () => void,
    loadingResetAction: () => void,
    rollbackAction?: () => void
  ) => {
    loadingAction();
    try {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));
      operation();
    } catch (error) {
      if (rollbackAction) {
        rollbackAction();
      }
      toast.error("Operation failed. Please try again.");
    } finally {
      loadingResetAction();
    }
  };

  const handleCreateTask = async (
    data: Omit<
      Task,
      "id" | "ownerId" | "assignedUsers" | "createdAt" | "updatedAt"
    >
  ) => {
    if (!userProfile) {
      toast.error("You must be logged in to create tasks");
      return;
    }

    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      ownerId: userProfile.id,
      assignedUsers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await simulateServerOperation(
      () => {
        dispatch(addTask(newTask));
        setIsDialogOpen(false);
        toast.success("Task created successfully");
      },
      () => dispatch(setCreateLoading(true)),
      () => dispatch(setCreateLoading(false))
    );
  };

  const handleUpdateTask = async (
    data: Omit<
      Task,
      "id" | "ownerId" | "assignedUsers" | "createdAt" | "updatedAt"
    >
  ) => {
    if (!editingTask || !userProfile) return;

    const canEdit =
      userProfile.role === "admin" || editingTask.ownerId === userProfile.id;
    if (!canEdit) {
      toast.error("You don't have permission to edit this task");
      return;
    }

    const updatedTask: Task = {
      ...editingTask,
      ...data,
      assignedUsers: editingTask.assignedUsers || [],
      updatedAt: new Date().toISOString(),
    };

    await simulateServerOperation(
      () => {
        dispatch(updateTask(updatedTask));
        setEditingTask(null);
        toast.success("Task updated successfully");
      },
      () => dispatch(setUpdateLoading({ id: editingTask.id, loading: true })),
      () => dispatch(setUpdateLoading({ id: editingTask.id, loading: false }))
    );
  };

  const handleDeleteTask = async (id: string) => {
    if (!userProfile) return;

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const canDelete =
      userProfile.role === "admin" || task.ownerId === userProfile.id;
    if (!canDelete) {
      toast.error("You don't have permission to delete this task");
      return;
    }

    await simulateServerOperation(
      () => {
        dispatch(deleteTask(id));
        toast.success("Task deleted successfully");
      },
      () => dispatch(setDeleteLoading({ id, loading: true })),
      () => dispatch(setDeleteLoading({ id, loading: false }))
    );
  };

  const handleDragEnd = (result: {
    active: { id: string };
    over: { id: string } | null;
  }) => {
    const { active, over } = result;

    if (!over || !userProfile) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const canUpdateStatus =
      userProfile.role === "admin" ||
      task.ownerId === userProfile.id ||
      (task.assignedUsers || []).includes(userProfile.id);

    if (!canUpdateStatus) {
      toast.error("You don't have permission to update this task's status");
      return;
    }

    const updatedTask: Task = {
      ...task,
      state: over.id as Task["state"],
      updatedAt: new Date().toISOString(),
    };

    dispatch(optimisticUpdateTask(updatedTask));
    simulateServerOperation(
      () => {
        dispatch(updateTask(updatedTask));
        toast.success("Task status updated");
      },
      () => dispatch(setUpdateLoading({ id: updatedTask.id, loading: true })),
      () => dispatch(setUpdateLoading({ id: updatedTask.id, loading: false })),
      () => dispatch(optimisticUpdateTask({ ...task, state: task.state }))
    );
  };

  const userTasks = tasks.filter((task) => {
    if (!userProfile) return false;
    // Show all tasks regardless of ownership
    return true;
  });

  const filteredTasks = userTasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesState = stateFilter === "all" || task.state === stateFilter;
    return matchesSearch && matchesPriority && matchesState;
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Ideanest Task</h1>
        <p className="text-lg text-gray-600 mb-8">
          Please sign in to manage your tasks.
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-2 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Task Management</h1>
        <div className="flex gap-4 items-center">
          <ViewToggle view={view} onViewChange={setView} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={handleCreateTask} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        stateFilter={stateFilter}
        onStateChange={setStateFilter}
      />
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            No tasks found matching your filters.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              userProfile={userProfile}
            />
          ))}
        </div>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          onDragEnd={handleDragEnd}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          userProfile={userProfile}
        />
      )}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={handleUpdateTask}
              initialData={editingTask}
              submitLabel="Update Task"
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
