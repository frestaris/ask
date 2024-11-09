import { useEffect, useState } from "react";
import { Image, Row, Col, Stack } from "react-bootstrap";
import moment from "moment";

function Comment({ comment }) {
  const [user, setUser] = useState({});

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
    </div>
  );
}

export default Comment;
