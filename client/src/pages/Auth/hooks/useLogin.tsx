import token from "@services/token";
import trpc from "@utils/trpc";
import { useState } from "react";

export default function useLogin(nextFn?: () => void) {
  const [userError, setUserError] = useState("");

  const loginMut = trpc.users.login.useMutation({
    onSuccess(res) {
      if (res.ok) {
        token.set(res.data);
        if (nextFn) nextFn();
      } else {
        switch (res.message) {
          case "user not found":
          case "wrong password": {
            setUserError("Email or Password is wrong");
          }
        }
      }
    },
    onError() {
      setUserError("An error occured: Please try again later");
    },
  });

  return {
    exec: async (props: { email: string; password: string }) =>
      await loginMut.mutateAsync({ userData: props, options: { expires: "short" } }).catch((_) => null),
    status: loginMut.status,
    error: userError,
  };
}
