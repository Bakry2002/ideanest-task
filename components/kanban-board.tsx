"use client";

import { Task } from "@/lib/store/taskSlice";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDragEnd: (result: DropResult) => void;
}
const columns = [
  {
    id: "todo",
    title: "To Do",
    color: "border-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    icon: "📋",
  },
  {
    id: "doing",
    title: "In Progress",
    color: "border-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    icon: "⚡",
  },
  {
    id: "done",
    title: "Done",
    color: "border-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: "✅",
  },
];

export function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onDragEnd,
}: KanbanBoardProps) {
  const getTasksByState = (state: string) => {
    return tasks.filter((task) => task.state === state);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <Card
                className={`${
                  snapshot.isDraggingOver ? "bg-muted/50" : ""
                } h-[550px] overflow-y-auto`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <CardHeader
                  className={`border-t-4 ${column.color} ${column.bgColor}`}
                >
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <span className="text-2xl">{column.icon}</span>
                    {column.title}
                    <span className="ml-auto px-3 py-1 bg-white/50 dark:bg-gray-700/50 rounded-full text-sm">
                      {getTasksByState(column.id).length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {getTasksByState(column.id).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? "opacity-50" : ""
                            }`}
                          >
                            <TaskCard
                              task={task}
                              onEdit={onEdit}
                              onDelete={onDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </CardContent>
              </Card>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
