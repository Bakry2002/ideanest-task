"use client";

import { Task } from "@/lib/store/taskSlice";
import { UserProfile } from "@/lib/store/userSlice";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import KanbanColumn from "./kanban-column";

interface Props {
  tasks: Task[];
  onDragEnd: (result: {
    active: { id: string };
    over: { id: string } | null;
  }) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  userProfile: UserProfile | null;
}

const KanbanBoard = ({
  tasks,
  onDragEnd,
  onDelete,
  onEdit,
  userProfile,
}: Props) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (task && task.state !== over.id) {
      onDragEnd({
        active: { id: active.id as string },
        over: { id: over.id as string },
      });
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={tasks.filter((task) => task.state === "todo")}
          onEdit={onEdit}
          onDelete={onDelete}
          userProfile={userProfile}
        />
        <KanbanColumn
          title="In Progress"
          status="doing"
          tasks={tasks.filter((task) => task.state === "doing")}
          onEdit={onEdit}
          onDelete={onDelete}
          userProfile={userProfile}
        />
        <KanbanColumn
          title="Done"
          status="done"
          tasks={tasks.filter((task) => task.state === "done")}
          onEdit={onEdit}
          onDelete={onDelete}
          userProfile={userProfile}
        />
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
