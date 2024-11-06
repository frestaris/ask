import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      } shadow-sm px-4 py-2`}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-semibold text-warning">
          Ask!
        </Link>
        <div className="d-flex align-items-center ms-auto">
          <button
            className={`btn btn-link fs-3 ${
              darkMode ? "text-light" : "text-dark"
            }`}
            onClick={handleDarkModeToggle}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="sign-in">
            <button
              className={`btn btn-link fs-5 ms-3 text-decoration-none ${
                darkMode ? "text-light" : "text-dark"
              }`}
            >
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
