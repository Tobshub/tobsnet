import token from "@services/token";
import { LoaderFunctionArgs, redirect } from "react-router-dom";

export { LoginPage } from "./login";
export { SignUpPage } from "./signUp";

/** Auth route loader function */
export async function loader({}: LoaderFunctionArgs) {
  const userToken = token.get();
  if (userToken) {
    // TODO: redirect to the account page
    return redirect("/");
  }
  return null;
}
