import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const resp: Response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      body: JSON.stringify(loginFormData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (resp.ok) {
      const res = await resp.json();
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("currentUser", JSON.stringify(res.user));
      window.location.pathname = "/main";
    } else {
      alert("Sign in failed");
    }
  };

  const handleInputChange = (e: any) => {
    const { target } = e;
    const value = target.value;
    const name = target.name;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center mt-5">
        <div className="col-md-6">
          <Form onSubmit={handleSubmit}>
            <h3 className="mb-4">Authorization</h3>
            <Form.Group controlId="login-username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                placeholder="Enter username"
                value={loginFormData.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="login-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="mb-2"
                name="password"
                type="password"
                placeholder="Enter password"
                value={loginFormData.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="auth-buttons d-flex justify-content-between">
              <Button variant="primary" type="submit">
                Sign In
              </Button>
              <div>
                <span style={{ marginLeft: "10px" }}>Not registered?</span>
                <Button
                  style={{ marginLeft: "5px" }}
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/sign-up")}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
