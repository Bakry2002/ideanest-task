import { Task } from "@/lib/store/taskSlice";
import { useDroppable } from "@dnd-kit/core";
import KanbanTaskCard from "./kanban-task-card";

interface Props {
  title: string;
  status: "todo" | "doing" | "done";
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const columnStyles = {
  todo: "bg-slate-50 border-slate-200",
  doing: "bg-blue-50 border-blue-200",
  done: "bg-green-50 border-green-200",
};

const KanbanColumn = ({ title, status, tasks, onEdit, onDelete }: Props) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${columnStyles[status]} rounded-lg p-4 border-2 min-h-[500px]`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-700">{title}</h2>
        <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <KanbanTaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
