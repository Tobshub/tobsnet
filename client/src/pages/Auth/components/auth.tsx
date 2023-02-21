import "../auth.scss";
import { Form, Link } from "react-router-dom";
import { PropsWithChildren, PropsWithRef, useEffect, useState } from "react";
import { GrClose as GrFormClose } from "react-icons/gr";
import { IconContext } from "react-icons";
import useLogin from "../hooks/useLogin";
import useSignup from "../hooks/useSignup";

type AuthPageProps = (
  | { type: "login"; content: { email: string; password: string } }
  | { type: "sign-up"; content: { email: string; password: string; username: string } }
) & { nextFn?: () => void; setCanSubmit: React.Dispatch<React.SetStateAction<boolean>> };

export default function AuthPage(props: PropsWithChildren & AuthPageProps) {
  const loginMut = useLogin(props.nextFn);
  const signupMut = useSignup(props.nextFn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (props.type === "login") {
      await loginMut.exec(props.content);
    } else if (props.type === "sign-up") {
      await signupMut.exec(props.content);
    }
  };

  const [authErrors, setAuthErrors] = useState("");

  useEffect(() => {
    if (props.type === "login") {
      setAuthErrors(loginMut.error);
      props.setCanSubmit(loginMut.status === "idle" || loginMut.status === "error" ? true : false);
    } else if (props.type === "sign-up") {
      setAuthErrors(signupMut.error);
      props.setCanSubmit(signupMut.status === "idle" || signupMut.status === "error" ? true : false);
    }
  }, [loginMut.status, signupMut.status]);

  return (
    <div className="page d-flex flex-column justify-content-center align-items-center">
      <IconContext.Provider
        value={{ className: "react-icons", style: { color: "var(--color-neutral-100)" }, size: "2rem" }}
      >
        <div className="auth-form d-flex justify-content-end">
          <Link to="/" className="btn">
            <GrFormClose />
          </Link>
        </div>
        <h1>{props.type === "login" ? "Log In" : "Sign Up"}</h1>
        {authErrors ? <p className="alert alert-danger">{authErrors}</p> : null}
        <Form onSubmit={handleSubmit} className="auth-form mb-3">
          {props.children}
        </Form>
      </IconContext.Provider>
    </div>
  );
}
