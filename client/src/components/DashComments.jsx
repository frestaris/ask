import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table, Spinner } from "react-bootstrap";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getBaseUrl } from "../utils/baseUrl";

function DashComments() {
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getBaseUrl()}/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) fetchComments();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    setLoading(true);
    try {
      const res = await fetch(
        `${getBaseUrl()}/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${getBaseUrl()}/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        toast.success(data.message || "Comment deleted successfully!");
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
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
      ) : currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table
            striped
            bordered
            responsive
            variant={theme === "dark" ? "dark" : "light"}
          >
            <thead>
              <tr>
                <th>Date Updated</th>
                <th>Comment Content</th>
                <th>Number of Likes</th>
                <th>Question ID</th>
                <th>User ID</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id}>
                  <td>{new Date(comment.updatedAt).toLocaleDateString()}</td>
                  <td>{comment.content}</td>
                  <td>{comment.numberOfLikes}</td>
                  <td>
                    {comment.questionId ? (
                      <Link to={`/question/${comment.questionId.slug}`}>
                        {comment.questionId.slug}
                      </Link>
                    ) : (
                      <span>Unavailable</span>
                    )}
                  </td>
                  <td>{comment.userId}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
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
        <p>You have no comments yet!</p>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton />
        <Modal.Body className="text-center">
          <HiOutlineExclamationCircle
            className="mb-3"
            size="2em"
            color="gray"
          />
          <h5>Are you sure you want to delete this comment?</h5>
          <div className="d-flex justify-content-center mt-4 gap-3">
            <Button variant="danger" onClick={handleDeleteComment}>
              Yes, I'm sure
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashComments;
