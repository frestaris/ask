import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RiEdit2Fill, RiDeleteBin7Fill } from "react-icons/ri";

function DashQuestions() {
  const { currentUser } = useSelector((state) => state.user);
  const [userQuestions, setUserQuestions] = useState([]);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `/api/question/getquestions?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok && data.questions) {
          setUserQuestions(data.questions);
        }
      } catch (error) {
        console.log("Error fetching questions:", error);
      }
    };

    if (currentUser.isAdmin) fetchQuestions();
  }, [currentUser._id]);

  return (
    <div
      className="table-responsive p-3"
      style={{
        backgroundColor: theme === "dark" ? "#333333" : "#f8f9fa",
        color: theme === "dark" ? "#fff" : "#000",
      }}
    >
      {currentUser.isAdmin && userQuestions.length > 0 ? (
        <Table
          striped
          bordered
          hover
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
                  <Link to={`/question${question.slug}`}>
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
                  </Link>
                </td>
                <td>
                  <Link
                    className={theme === "dark" ? "text-white" : "text-dark"}
                    to={`/question${question.slug}`}
                  >
                    {question.title}
                  </Link>
                </td>
                <td>{question.category}</td>
                <td className="text-center">
                  <Button
                    variant={theme === "dark" ? "danger" : "outline-danger"}
                    onClick={() => console.log("Delete", question._id)}
                  >
                    <RiDeleteBin7Fill />
                  </Button>
                </td>
                <td className="text-center">
                  <Link
                    variant={theme === "dark" ? "info" : "outline-info"}
                    onClick={() => console.log("Edit", question._id)}
                  >
                    <RiEdit2Fill />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>You have no questions yet!</p>
      )}
    </div>
  );
}

export default DashQuestions;
