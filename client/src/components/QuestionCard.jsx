import { Link } from "react-router-dom";
import { Card, Badge } from "react-bootstrap";
import { FaCommentAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function QuestionCard({ question, questionId }) {
  const { theme } = useSelector((state) => state.theme);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      if (!questionId) {
        console.error("Question ID is undefined");
        return;
      }
      try {
        const res = await fetch(
          `/api/comment/getQuestionComments/${questionId}`
        );
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
    };
    getComments();
  }, [questionId]);

  const commentCount = comments.length;

  return (
    <Link to={`/question/${question.slug}`} className="text-decoration-none">
      <Card
        className={`d-flex flex-column h-100 ${
          theme === "dark" ? "text-light" : "text-dark"
        }`}
        style={{
          backgroundColor: theme === "dark" ? "#333333" : "#f8f9fa",
        }}
      >
        <Card.Img
          variant="top"
          src={question.image}
          alt="question cover"
          className="w-100"
          style={{ objectFit: "cover", height: "200px" }}
        />
        <Card.Body className="d-flex flex-column justify-between p-3">
          <Card.Title className="fw-bold text-truncate">
            {question.title}
          </Card.Title>
          <Card.Subtitle className="text-center">
            <span className="badge rounded-pill bg-secondary">
              {question && question.category}
            </span>
          </Card.Subtitle>
          <hr />
          <Card.Text className="text-truncate">
            {question.content.replace(/<[^>]+>/g, "")}
          </Card.Text>
          <div className="mt-auto d-flex gap-3">
            {commentCount > 0 ? (
              <Badge
                className="bg-transparent position-relative mt-3"
                style={{ padding: 0, margin: 0 }}
              >
                <FaCommentAlt
                  className="me-1"
                  style={{
                    color: theme === "dark" ? "white" : "gray",
                  }}
                  size="1.2rem"
                />

                <span
                  style={{
                    padding: "0.2rem 0.4rem",
                    borderRadius: "50%",
                    backgroundColor: "#17a2b8",
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                  }}
                >
                  {commentCount}
                </span>
              </Badge>
            ) : (
              <FaCommentAlt
                className="me-1"
                style={{
                  color: theme === "dark" ? "white" : "gray",
                }}
                size="1.2rem"
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default QuestionCard;
