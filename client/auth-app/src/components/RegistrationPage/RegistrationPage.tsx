import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const [regFormData, setRegFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const resp: Response = await fetch(
      "http://localhost:5000/auth/registration",
      {
        method: "POST",
        body: JSON.stringify(regFormData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (resp.ok) {
      alert("Registration successful");
      window.location.pathname = "/";
    } else {
      alert("Registration failed");
    }
  };

  const handleInputChange = (e: any) => {
    const { target } = e;
    const value = target.value;
    const name = target.name;
    setRegFormData({
      ...regFormData,
      [name]: value,
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center mt-5">
        <div className="col-md-6">
          <Form onSubmit={handleSubmit}>
            <h3 className="mb-4">Registration</h3>
            <Form.Group controlId="reg-username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={regFormData.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="reg-email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Enter email"
                value={regFormData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="reg-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="mb-2"
                name="password"
                type="password"
                placeholder="Enter password"
                value={regFormData.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="auth-buttons d-flex justify-content-between">
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
              <div>
                <span style={{ marginLeft: "10px" }}>Already registered?</span>
                <Button
                  style={{ marginLeft: "5px" }}
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
