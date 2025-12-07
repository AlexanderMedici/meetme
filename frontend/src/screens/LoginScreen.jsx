import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { Button, Form, Spinner } from "react-bootstrap";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-g-badge">G</div>
          <span>Sign in</span>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to continue to MeetMe Calendar.</p>

        <Form onSubmit={submitHandler} className="auth-form">
          <Form.Group controlId="email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="auth-submit w-100"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "Sign in"}
          </Button>
        </Form>

        <div className="auth-divider" />

        <div className="auth-footer">
          <span>New to MeetMe?</span>
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="auth-link"
          >
            Create an account
          </Link>
        </div>
      </div>
      <div className="auth-lang">English (United States)</div>
    </div>
  );
};

export default LoginScreen;
