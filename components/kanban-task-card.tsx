import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskPermissions } from "@/hooks/use-task-permissions";
import { Task } from "@/lib/store/taskSlice";
import { UserProfile } from "@/lib/store/userSlice";
import { useDraggable } from "@dnd-kit/core";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  userProfile: UserProfile | null;
}

const priorityColors = {
  low: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border border-amber-200",
  high: "bg-rose-100 text-rose-700 border border-rose-200",
};

const stateColors = {
  todo: "bg-slate-100 border-slate-200",
  doing: "bg-blue-50 border-blue-200",
  done: "bg-green-50 border-green-200",
};

const KanbanTaskCard = ({ task, onEdit, onDelete, userProfile }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const { canEdit, canDelete } = useTaskPermissions(task, userProfile);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${
        stateColors[task.state]
      } p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md`}
    >
      <div className="flex justify-between items-start mb-2">
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
          <h3 className="font-medium text-gray-900">{task.title}</h3>
        </div>
        {(canDelete || canEdit) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-gray-100 p-1 rounded">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3">{task.description}</p>

      <div className="flex items-center gap-2">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default KanbanTaskCard;
