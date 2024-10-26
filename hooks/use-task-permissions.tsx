"use client";

import { Task } from "@/lib/store/taskSlice";
import { UserProfile } from "@/lib/store/userSlice";

export function useTaskPermissions(
  task: Task,
  userProfile: UserProfile | null
) {
  const isAdmin = userProfile?.role === "admin";
  const isOwner = task?.ownerId === userProfile?.id;
  const isAssigned =
    task?.assignedUsers?.includes(userProfile?.id || "") || false;

  return {
    canEdit: isAdmin || isOwner,
    canDelete: isAdmin || isOwner,
    canUpdateStatus: isAdmin || isOwner || isAssigned,
    canView: true,
  };
}
