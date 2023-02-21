import token from "@services/token";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import trpc from "@utils/trpc";

// change url for production deploy
const { PROD } = import.meta.env;
const API_URL = PROD ? "" : "http://localhost:8080/api";

export const appQueryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60, refetchOnWindowFocus: false } },
});

export const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: API_URL, headers: () => ({ authorization: token.get() }) })],
});
