import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";

function DashUsers() {
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        toast.success(data.message || "User deleted successfully!");
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="pb-2" style={{ maxHeight: "680px", overflowY: "auto" }}>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" />
        </div>
      ) : currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table
            striped
            bordered
            responsive
            variant={theme === "dark" ? "dark" : "light"}
          >
            <thead>
              <tr>
                <th>Date Created</th>
                <th>User Image</th>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td className="text-center">
                    {user.isAdmin ? (
                      <FaCheck className="text-success" />
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {showMore && (
            <div className="text-center">
              <Button variant="outline-warning" onClick={handleShowMore}>
                Show More
              </Button>
            </div>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="mb-4"
              style={{ fontSize: "5rem", color: "gray" }}
            />
            <h3 className="mb-5 fs-4 text-muted">
              Are you sure you want to delete this user?
            </h3>
            <div className="d-flex justify-content-center gap-4">
              <Button variant="danger" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashUsers;
