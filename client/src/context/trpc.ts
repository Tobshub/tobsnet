import token from "@services/token";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import trpc from "@utils/trpc";

// change url for production deploy
const { PROD } = import.meta.env;
const API_URL = PROD ? "" : "http://localhost:8080/api";

export const appQueryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: API_URL, headers: () => ({ authorization: token.get() }) })],
});
