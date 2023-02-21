import token from "@services/token";
import trpc from "@utils/trpc";

export default function useLogin(nextFn?: () => void) {
  const loginMut = trpc.users.login.useMutation({
    onSuccess(res) {
      token.set(res.data);
      if (nextFn) nextFn();
    },
    onError(error) {
      console.log(error);
    },
  });

  return {
    exec: async (props: { email: string; password: string }) =>
      await loginMut.mutateAsync({ userData: props, options: { expires: "short" } }),
    status: loginMut.status,
  };
}
