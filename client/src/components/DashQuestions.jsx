import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import { getBaseUrl } from "../utils/baseUrl";

function DashQuestions() {
  const { currentUser } = useSelector((state) => state.user);
  const [userQuestions, setUserQuestions] = useState([]);
  const { theme } = useSelector((state) => state.theme);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [questionIdToDelete, setQuestionIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getBaseUrl()}/api/question/getquestions`, {
          method: "GET",
          credentials: "include", // Ensure credentials (cookies) are included
        });
        const data = await res.json();

        if (res.ok && data.questions) {
          setUserQuestions(data.questions);
          if (data.questions.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userQuestions.length;
    setLoading(true);
    try {
      const res = await fetch(
        `${getBaseUrl()}/api/question/getquestions?startIndex=${startIndex}`,
        {
          method: "GET",
          credentials: "include", // Ensure credentials (cookies) are included
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setUserQuestions((prev) => [...prev, ...data.questions]);
        if (data.questions.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${getBaseUrl()}/api/question/deletequestion/${questionIdToDelete}/${
          currentUser._id
        }`,
        {
          method: "DELETE",
          credentials: "include", // Include credentials (cookies)
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserQuestions((prev) =>
          prev.filter((question) => question._id !== questionIdToDelete)
        );
        toast.success(data.message || "Question deleted successfully!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className="pb-2"
      style={{
        backgroundColor: theme === "dark" ? "#333333" : "#f8f9fa",
        color: theme === "dark" ? "#fff" : "#000",
        maxHeight: "680px",
        overflowY: "auto",
      }}
    >
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" />
        </div>
      ) : currentUser.isAdmin && userQuestions.length > 0 ? (
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
                <th>Question Image</th>
                <th>Question Title</th>
                <th>Category</th>
                <th>Delete</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {userQuestions.map((question) => (
                <tr key={question._id}>
                  <td>{new Date(question.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <img
                      src={question.image}
                      alt={question.title}
                      style={{
                        width: "100px",
                        height: "60px",
                        objectFit: "cover",
                        backgroundColor: "#ccc",
                      }}
                    />
                  </td>
                  <td>
                    <Link to={`/question/${question.slug}`}>
                      {question.title}
                    </Link>
                  </td>
                  <td>{question.category}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        setShowModal(true);
                        setQuestionIdToDelete(question._id);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                  <td className="text-center">
                    <Link
                      variant={theme === "dark" ? "info" : "outline-info"}
                      onClick={() => console.log("Edit", question._id)}
                      to={`/update-question/${question._id}`}
                    >
                      <RiEdit2Fill
                        style={{ fontSize: "24px", marginTop: "0.6rem" }}
                      />
                    </Link>
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
        <p>You have no questions yet!</p>
      )}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="md"
        centered
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="mb-4"
              style={{ fontSize: "5rem", color: "gray" }}
            />
            <h3 className="mb-5 fs-4 text-muted">
              Are you sure you want to delete this question?
            </h3>
            <div className="d-flex justify-content-center gap-4">
              <Button variant="danger" onClick={handleDeleteQuestion}>
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

export default DashQuestions;
