import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@server/src/app/router";

const trpc = createTRPCReact<AppRouter>();
export default trpc;
