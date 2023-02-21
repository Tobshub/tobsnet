import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthPage from "./components/auth";

export function SignUpPage() {
  const [content, setContent] = useState({ email: "", password: "", username: "" });
  const [canSubmit, setCanSubmit] = useState(false);
  const validContent = !!content.email && !!content.password && !!content.username;

  const handleChange = (name: "email" | "password" | "username", text: string) => {
    setContent((state) => ({ ...state, [name]: text }));
    if (!canSubmit) setCanSubmit(true);
  };

  const navigate = useNavigate();
  const nextFn = () => {
    navigate("/");
  };

  return (
    <AuthPage type="sign-up" content={content} nextFn={nextFn} setCanSubmit={setCanSubmit}>
      <fieldset className="mb-3">
        <label className="d-block">
          <span className="form-label d-block">Username:</span>
          <input
            className="form-control"
            type="text"
            placeholder="Cool_Guy_77"
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </label>
      </fieldset>
      <fieldset className="mb-3">
        <label className="d-block">
          <span className="form-label d-block">Email:</span>
          <input
            className="form-control"
            type="email"
            placeholder="example@domain.com"
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </label>
      </fieldset>
      <fieldset className="mb-3">
        <label className="d-block">
          <span className="form-label d-block">Password:</span>
          <input
            className="form-control"
            type="password"
            placeholder="********"
            minLength={8}
            maxLength={64}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </label>
      </fieldset>
      <div className="mb-2">
        <button className="btn btn-primary" disabled={!(canSubmit && validContent)} type="submit">
          Sign Up
        </button>
      </div>
      <p>
        Already have an account? <Link to={"../login"}>Log In</Link> instead.
      </p>
    </AuthPage>
  );
}
