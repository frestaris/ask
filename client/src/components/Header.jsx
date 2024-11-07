import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";
import { Dropdown, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useSidebar } from "../contexts/SidebarContext";

const Header = () => {
  const dispatch = useDispatch(toggleTheme);
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  const isDashboardPage = location.pathname === "/dashboard";

  return (
    <nav className={`navbar navbar-expand-lg border-bottom shadow-sm`}>
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
            {theme === "dark" ? <FaSun size={25} /> : <FaMoon size={25} />}
          </button>

          {currentUser ? (
            <Dropdown align="end" className="ms-3">
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                className="p-0 border-0"
                bsPrefix="custom-toggle"
                caret="false"
              >
                <img
                  alt="user"
                  src={currentUser.profilePicture}
                  className="img-fluid rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid orange",
                  }}
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
          {isDashboardPage && (
            <button
              className="d-block d-md-none btn btn-link fs-3 ms-3"
              onClick={toggleSidebar}
            >
              <FaBars style={{ color: "orange" }} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
