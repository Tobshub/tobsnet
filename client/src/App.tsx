import { appQueryClient, trpcClient } from "@context/trpc";
import LoginPage from "@pages/Auth/login";
import SignUpPage from "@pages/Auth/signUp";
import { QueryClientProvider } from "@tanstack/react-query";
import trpc from "@utils/trpc";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    index: true,
    element: <>Hello world </>,
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={appQueryClient}>
      <QueryClientProvider client={appQueryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
