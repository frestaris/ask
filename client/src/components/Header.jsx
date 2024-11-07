import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { Dropdown, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";

const Header = () => {
  const dispatch = useDispatch(toggleTheme);
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  return (
    <nav className={`navbar navbar-expand-lg`}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-semibold text-warning">
          Ask!
        </Link>
        <div className="d-flex align-items-center ms-auto">
          <button
            className={`btn btn-link fs-3`}
            onClick={() => dispatch(toggleTheme())}
            style={{ color: "orange" }}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
          {currentUser ? (
            <Dropdown align="end" className="ms-3">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                className="p-0 border-0"
              >
                <img
                  alt="user"
                  src={currentUser.profilePicture}
                  className="img-fluid rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header>
                  <span className="d-block text-sm">
                    @{currentUser.username}
                  </span>
                  <span className="d-block text-sm font-weight-medium">
                    {currentUser.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Link to="/dashboard?tab=profile" className="dropdown-item">
                  Profile
                </Link>
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Link to="/sign-in" className="ms-3">
              <Button variant="outline-primary">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
