import token from "@services/token";
import trpc from "@utils/trpc";
import { useState } from "react";

export default function useSignup(nextFn?: () => void) {
  const [userError, setUserError] = useState("");

  const signupMut = trpc.users.signUp.useMutation({
    onSuccess(res) {
      if (res.ok) {
        token.set(res.data);
        if (nextFn) nextFn();
      } else {
        switch (res.message) {
          case "user already exists": {
            setUserError("An account exists with that Email");
          }
        }
      }
    },
    onError() {
      setUserError("An error occured: Please try again later");
    },
  });

  return {
    exec: async (props: { username: string; email: string; password: string }) =>
      await signupMut.mutateAsync(props).catch((_) => null),
    status: signupMut.status,
    error: userError,
  };
}
