import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthPage from "./components/auth";

export default function LoginPage() {
  const [content, setContent] = useState({ email: "", password: "" });

  const handleChange = (name: "email" | "password", text: string) =>
    setContent((state) => ({ ...state, [name]: text }));

  const [canSubmit, setCanSubmit] = useState(false);
  const validContent = !!content.email && !!content.password;

  const navigate = useNavigate();
  const nextFn = () => {
    navigate("/");
  };

  return (
    <AuthPage type="login" content={content} nextFn={nextFn} setCanSubmit={setCanSubmit}>
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
          Login
        </button>
      </div>
      <p>
        New user? <Link to={"../sign-up"}>Sign Up</Link> instead.
      </p>
    </AuthPage>
  );
}
