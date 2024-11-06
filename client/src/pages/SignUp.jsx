import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, InputGroup, Button, Spinner, Alert } from "react-bootstrap";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="d-flex mt-5 justify-content-center align-items-center">
      <div className="container-sm d-flex mt-5 p-3 flex-column flex-md-row align-items-center gap-4">
        <div className="flex-grow-1 col-12 col-md-6">
          <Link
            to="/"
            className="fw-bold text-dark display-4 text-decoration-none"
          >
            <span
              className="px-2 py-1 text-white rounded"
              style={{
                background: "linear-gradient(to right, #f97316, #000)",
                display: "inline-block",
              }}
            >
              Ask
            </span>
          </Link>
          <p className="small mt-3 text-muted">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque saepe
            obcaecati, ut quis magni sit. Dolores dicta nobis odio. Ex
            consectetur similique quasi id nihil ea perspiciatis tempore
            doloremque eum.
          </p>
        </div>
        <div className="flex-grow-1 col-12 col-md-6">
          <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>Username</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="..."
                  id="username"
                  className="form-control"
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type="email"
                  placeholder="Your email..."
                  id="email"
                  className="form-control"
                  onChange={handleChange}
                />
                <InputGroup.Text id="basic-addon2">
                  @example.com
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>🔒</InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="form-control"
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              className="btn btn-warning w-100"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" /> : "Sign Up"}
            </Button>
          </form>
          <div className="d-flex gap-2 small mt-3">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-primary">
              Sign In
            </Link>
          </div>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
