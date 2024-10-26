"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RootState } from "@/lib/store/store";
import { Task } from "@/lib/store/taskSlice";
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800 hover:bg-green-200",
  medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  high: "bg-red-100 text-red-800 hover:bg-red-200",
};

const stateColors = {
  todo: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  doing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  done: "bg-purple-100 text-purple-800 hover:bg-purple-200",
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const isUpdateLoading = useSelector(
    (state: RootState) => state.tasks.loadingStates.update[task.id]
  );
  const isDeleteLoading = useSelector(
    (state: RootState) => state.tasks.loadingStates.delete[task.id]
  );

  return (
    <TooltipProvider delayDuration={50}>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {task.image && (
                <Image
                  src={task.image}
                  alt="task image"
                  width={40}
                  height={40}
                  className="aspect-square rounded-full object-cover"
                />
              )}
              <CardTitle className="text-xl font-bold">{task.title}</CardTitle>
            </div>

            <div className="flex gap-2">
              <Badge className={priorityColors[task.priority]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <Badge className={stateColors[task.state]}>
                {task.state.charAt(0).toUpperCase() + task.state.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(task)}
                disabled={isUpdateLoading || isDeleteLoading}
              >
                {isUpdateLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(task.id)}
                disabled={isUpdateLoading || isDeleteLoading}
              >
                {isDeleteLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
