"use client";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { buttonVariants } from "./ui/button";

export const PageHeader = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useKindeAuth();

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
            <LogoutLink className={buttonVariants({ variant: "outline" })}>
              Sign out
            </LogoutLink>
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
