import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { ListGroup } from "react-bootstrap";
import { useSidebar } from "../contexts/SidebarContext";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { toast } from "react-toastify";

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { closeSidebar } = useSidebar();
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const ItemClass = theme === "dark" ? "bg-warning" : "bg-light";

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        toast.success("User logged out!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={`d-flex flex-column border rounded border-0 ${
        theme === "dark" ? "dark-mode" : ""
      }`}
    >
      <ListGroup variant="flush">
        <Link
          to="/dashboard?tab=profile"
          className="text-decoration-none"
          onClick={closeSidebar}
        >
          <ListGroup.Item
            action
            active={tab === "profile"}
            className={`d-flex align-items-center border-0 rounded-3 mb-2 hover-item ${ItemClass}`}
          >
            <HiUser className="me-2" />
            Profile
          </ListGroup.Item>
        </Link>
        <hr />
        <ListGroup.Item
          onClick={handleSignout}
          action
          className={`d-flex align-items-center border-0 rounded-3 mb-2 hover-item ${ItemClass}`}
        >
          <HiArrowSmRight className="me-2" />
          Sign Out
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default DashSidebar;
