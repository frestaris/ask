import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Alert, Col, Row, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import Comment from "./Comment";

function CommentSection({ questionId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          questionId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  return (
    <div className="py-3">
      {currentUser ? (
        <div className="d-flex align-items-center  my-3 text-sm">
          <p className="mb-0">Signed in as:</p>
          <Image
            src={currentUser.profilePicture}
            alt={currentUser.username}
            roundedCircle
            width={25}
            height={25}
            className="mx-1"
          />
          <Link to="/dashboard?tab=profile" className="text-decoration-none">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-info my-3">
          You must be signed in to comment.{" "}
          <Link to="/sign-in" className="text-primary">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <Form
          onSubmit={handleSubmit}
          className="border border-warning rounded p-3"
        >
          <Form.Group controlId="commentTextarea">
            <Form.Control
              as="textarea"
              placeholder="Add a comment..."
              rows="3"
              maxLength="200"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
          <Row className="mt-3">
            <Col className="d-flex justify-content-between">
              <p>{200 - comment.length} characters remaining</p>
              <Button variant="outline-warning" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
          {commentError && (
            <Alert variant="danger" className="mt-3">
              {commentError}
            </Alert>
          )}
        </Form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>
              Comments:{" "}
              <span className="border p-2 rounded">{comments.length}</span>
            </p>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;
