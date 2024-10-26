"use client";

import { useTaskPermissions } from "@/hooks/use-task-permissions";
import { Task } from "@/lib/store/taskSlice";
import { UserProfile } from "@/lib/store/userSlice";
import { Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  userProfile: UserProfile | null;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  userProfile,
}: TaskCardProps) {
  const { canEdit, canDelete } = useTaskPermissions(task, userProfile);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{task.title}</span>
          <div className="flex gap-2">
            {canEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
        <CardDescription className="flex flex-col gap-1">
          <span>Created {task.createdAt}</span>
          <span className="text-xs text-muted-foreground">
            Owner: {task.ownerId === userProfile?.id ? "You" : "Other"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {task.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              task.priority === "high"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              task.state === "todo"
                ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                : task.state === "doing"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            {task.state}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
