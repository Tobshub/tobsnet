import { appQueryClient, trpcClient } from "@context/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import trpc from "@utils/trpc";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    index: true,
    element: <>Hello world </>,
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
