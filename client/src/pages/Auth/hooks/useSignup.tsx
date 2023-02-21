import token from "@services/token";
import trpc from "@utils/trpc";

export default function useSignup(nextFn?: () => void) {
  const signupMut = trpc.users.signUp.useMutation({
    onSuccess(res) {
      token.set(res.data);
      if (nextFn) nextFn();
    },
    onError(err) {
      console.log(err);
    },
  });

  return {
    exec: async (props: { username: string; email: string; password: string }) => await signupMut.mutateAsync(props),
    status: signupMut.status,
  };
}
