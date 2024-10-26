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

import { Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const SIMULATED_DELAY = 500; // 1 second delay to simulate server operations

export default function Home() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

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

  const handleCreateTask = async (data: Omit<Task, "id">) => {
    const newTask = {
      ...data,
      id: crypto.randomUUID(),
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

  const handleUpdateTask = async (data: Omit<Task, "id">) => {
    if (editingTask) {
      await simulateServerOperation(
        () => {
          dispatch(updateTask({ ...data, id: editingTask.id }));
          setEditingTask(null);
          toast.success("Task updated successfully");
        },
        () => dispatch(setUpdateLoading({ id: editingTask.id, loading: true })),
        () => dispatch(setUpdateLoading({ id: editingTask.id, loading: false }))
      );
    }
  };

  const handleDeleteTask = async (id: string) => {
    await simulateServerOperation(
      () => {
        dispatch(deleteTask(id));
        toast.success("Task deleted successfully");
      },
      () => dispatch(setDeleteLoading({ id, loading: true })),
      () => dispatch(setDeleteLoading({ id, loading: false }))
    );
  };

  const filteredTasks =
    tasks?.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesState = stateFilter === "all" || task.state === stateFilter;
      return matchesSearch && matchesPriority && matchesState;
    }) || [];

  const handleDragEnd = (result: {
    active: { id: string };
    over: { id: string } | null;
  }) => {
    const { active, over } = result;

    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      const updatedTask = {
        ...task,
        state: over.id as Task["state"],
      };

      dispatch(optimisticUpdateTask(updatedTask));
      simulateServerOperation(
        () => {
          dispatch(updateTask(updatedTask));
          toast.success("Task status updated");
        },
        () => dispatch(setUpdateLoading({ id: updatedTask.id, loading: true })),
        () =>
          dispatch(setUpdateLoading({ id: updatedTask.id, loading: false })),
        () => dispatch(optimisticUpdateTask({ ...task, state: task.state }))
      );
    }
  };

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
      {(filteredTasks?.length || 0) === 0 ? (
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
            />
          ))}
        </div>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          onDragEnd={handleDragEnd}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
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
