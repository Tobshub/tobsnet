import { appQueryClient, trpcClient } from "@context/trpc";
import { LoginPage, SignUpPage, loader as authLoader } from "@pages/Auth";
import HomePage from "@pages/Home/home";
import { QueryClientProvider } from "@tanstack/react-query";
import trpc from "@utils/trpc";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "/auth",
    loader: authLoader,
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
