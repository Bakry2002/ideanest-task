"use client";
import { clearUserProfile, setUserProfile } from "@/lib/store/userSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { LoaderCircle, User } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface User {
  id: string;
  email: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
  role: string | null; // Add role
  permissions: string[]; // Add permissions
}
export const PageHeader = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useKindeAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(
        setUserProfile({
          id: user.id || "",
          email: user.email || "",
          firstName: user.given_name || "",
          lastName: user.family_name || "",

          role:
            (user as User).role?.toLowerCase() === "admin"
              ? "admin"
              : "employee",
          permissions: (user as User).permissions || [],
        })
      );
    } else {
      dispatch(clearUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <nav className="bg-background drop-shadow-sm h-16 px-6 flex items-center w-full justify-between mb-4">
      <div>
        <h1 className="text-xl font-semibold">
          Ideanest <sub>Task</sub>
        </h1>
      </div>
      {isLoading ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{user.given_name || user.email}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Role: {(user as User).role || "Employee"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogoutLink>Sign out</LogoutLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <LoginLink className={buttonVariants({ variant: "outline" })}>
                Sign in
              </LoginLink>
              <RegisterLink className={buttonVariants()}>Sign up</RegisterLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
