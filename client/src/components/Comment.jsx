import { useEffect, useState } from "react";
import { Image, Row, Col, Button, Form } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import moment from "moment";

function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const isLikedByUser = currentUser && comment.likes.includes(currentUser._id);

  const iconColor = isLikedByUser
    ? "orange"
    : theme === "light"
    ? "black"
    : "white";

  return (
    <div className="p-3 border-bottom">
      <Row className="align-items-center">
        <Col xs="auto" className="d-flex align-items-center">
          <Image
            src={user.profilePicture}
            alt={user.username}
            roundedCircle
            width={30}
            height={30}
          />
          <strong className="ms-2 text-warning">
            {user ? `@${user.username}` : "anonymous user"}
          </strong>
        </Col>
        <Col className="d-flex justify-content-end">
          <span className="text-xs">{moment(comment.createdAt).fromNow()}</span>
        </Col>
      </Row>
      {isEditing ? (
        <>
          <Form.Control
            as="textarea"
            className="my-2"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="d-flex justify-content-end gap-2 text-xs">
            <Button
              type="button"
              variant="warning"
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="pb-2">{comment.content}</p>
          <div className="d-flex justify-content-between align-items-centermx-auto">
            <div className="align-items-center d-inline-flex border-top">
              <Button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                }}
                onClick={() => {
                  onLike(comment._id);
                }}
              >
                <FaThumbsUp className="mb-1" size="1em" color={iconColor} />
              </Button>
              <p className="mb-0">
                {comment.numberOfLikes > 0 &&
                  `${comment.numberOfLikes} ${
                    comment.numberOfLikes === 1 ? "Like" : "Likes"
                  }`}
              </p>
            </div>
            {currentUser &&
              (currentUser._id === comment.userId || currentUser.isAdmin) && (
                <div className="d-inline-flex border-top align-items-center">
                  <Button variant="link" size="sm" onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    className="text-danger text-decoration-none"
                    size="sm"
                    onClick={() => onDelete(comment._id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
}

export default Comment;
