import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashQuestions from "../components/DashQuestions";
import { Offcanvas } from "react-bootstrap";
import { useSidebar } from "../contexts/SidebarContext";
import { useSelector } from "react-redux";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

function Dashboard() {
  const { theme } = useSelector((state) => state.theme);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { showSidebar, toggleSidebar } = useSidebar();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`d-flex vh-100 ${theme}`}>
      {isMobile && (
        <Offcanvas
          show={showSidebar}
          onHide={toggleSidebar}
          placement="start"
          className={`${theme === "dark" ? "bg-dark" : "bg-light"}`}
        >
          <Offcanvas.Header closeButton></Offcanvas.Header>
          <Offcanvas.Body>
            <DashSidebar />
          </Offcanvas.Body>
        </Offcanvas>
      )}
      {!isMobile && (
        <div
          className={`d-none d-md-block p-3 border-right ${theme}`}
          style={{
            minHeight: "100vh",
            width: "250px",
            borderRight: "2px solid #ccc",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <DashSidebar />
        </div>
      )}
      <div className="flex-grow-1 p-3">
        {/* Dashboard */}
        {tab === "dash" && <DashboardComp />}
        {/* Profile */}
        {tab === "profile" && <DashProfile />}
        {/* Questions */}
        {tab === "questions" && <DashQuestions />}
        {/* Users */}
        {tab === "users" && <DashUsers />}
        {/* Comments */}
        {tab === "comments" && <DashComments />}
      </div>
    </div>
  );
}

export default Dashboard;
