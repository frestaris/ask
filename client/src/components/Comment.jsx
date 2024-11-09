import { useEffect, useState } from "react";
import { Image, Row, Col, Button } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import moment from "moment";

function Comment({ comment, onLike }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

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
      <p className="mt-2">{comment.content}</p>
      <div className="d-inline-flex align-items-center border-top mx-auto">
        <Button
          style={{
            backgroundColor: "transparent",
            border: "none",
          }}
          onClick={() => {
            onLike(comment._id);
          }}
        >
          <FaThumbsUp size="1em" color={iconColor} />
        </Button>
        <p className="mb-0">
          {comment.numberOfLikes > 0 &&
            `${comment.numberOfLikes} ${
              comment.numberOfLikes === 1 ? "Like" : "Likes"
            }`}
        </p>
      </div>
    </div>
  );
}

export default Comment;
