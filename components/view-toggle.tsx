"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kanban, LayoutGrid } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "kanban";
  onViewChange: (view: "grid" | "kanban") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewChange("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Grid View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={view === "kanban" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewChange("kanban")}
            >
              <Kanban className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Kanban Board</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
