import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Spinner } from "react-bootstrap";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-g-badge">G</div>
          <span>Create your Google account</span>
        </div>
        <h2 className="auth-title">Create an account</h2>
        <p className="auth-subtitle">
          Sign up to start scheduling with MeetMe Calendar.
        </p>

        <Form onSubmit={submitHandler} className="auth-form">
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Control
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
              required
            />
          </Form.Group>

          <Button
            disabled={isLoading}
            type="submit"
            className="auth-submit w-100"
          >
            {isLoading ? <Spinner size="sm" /> : "Create account"}
          </Button>
        </Form>

        <div className="auth-divider" />

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="auth-link"
          >
            Sign in
          </Link>
        </div>
      </div>
      <div className="auth-lang">English (United States)</div>
    </div>
  );
};

export default RegisterScreen;
