"use client";

import { Toaster } from "@/components/ui/sonner";
import { persistor, store } from "@/lib/store/store";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <KindeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </KindeProvider>
  );
}
