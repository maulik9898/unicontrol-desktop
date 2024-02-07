import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Root from "./routes/Root";
import Login from "./routes/auth/Login";
import PrivateRoutes from "./components/PrivateRoutes";
import { Authenticator } from "@aws-amplify/ui-react";
import "./lib/auth";
import Device from "./routes/Device";
import Firmware from "./routes/Firmware";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import "./event";
import Decoration from "./components/decoration";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoutes>
        <Root />
      </PrivateRoutes>
    ),
    children: [
      {
        path: "/firmware",
        element: <Firmware />,
      },
      {
        index: true,
        element: <Device />,
      },
    ],
  },
  {
    path: "/auth/login",
    element: <Login />,
    children: [],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Authenticator.Provider>
          <TooltipProvider>
            <div className="flex flex-col h-screen w-screen">
              <Decoration />
              <RouterProvider router={router}></RouterProvider>
            </div>
            <Toaster richColors closeButton />
          </TooltipProvider>
        </Authenticator.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
