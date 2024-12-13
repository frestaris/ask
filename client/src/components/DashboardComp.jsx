import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table, Card, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getBaseUrl } from "../utils/baseUrl";

function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthQuestions, setLastMonthQuestions] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${getBaseUrl()}api/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${getBaseUrl()}api/question/getquestions?limit=5`
        );
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
          setTotalQuestions(data.totalQuestions);
          setLastMonthQuestions(data.lastMonthQuestions);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${getBaseUrl()}api/comment/getcomments?limit=5`
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      setLoading(true);
      fetchUsers();
      fetchQuestions();
      fetchComments();
    }
  }, [currentUser]);

  useEffect(() => {
    if (users.length && comments.length && questions.length) {
      setLoading(false);
    }
  }, [users, comments, questions]);

  return (
    <div
      className="pb-2"
      style={{ maxHeight: "680px", overflowY: "auto", overflowX: "hidden" }}
    >
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" />
        </div>
      ) : (
        <Row className="flex-wrap gap-4 justify-content-center">
          <Col
            lg={3}
            md={5}
            sm={5}
            className="p-3 mb-4 border rounded"
            style={{
              backgroundColor: theme === "dark" ? "#333333" : "#f8f9fa",
              color: theme === "dark" ? "#fff" : "#000",
              maxHeight: "680px",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6>Total Users</h6>
              <span className="bg-primary rounded-circle p-2">
                <HiOutlineUserGroup size="2rem" style={{ color: "#fff" }} />
              </span>
            </div>
            <p className="h4">{totalUsers}</p>
            <div className="d-flex gap-2 text-sm">
              <span className="text-success">
                {lastMonthUsers > 0 && <HiArrowNarrowUp />}
                {lastMonthUsers}
              </span>
              <div>Last Month</div>
            </div>
          </Col>
          <Col
            lg={3}
            md={5}
            sm={5}
            className="p-3 mb-4 border rounded"
            style={{
              backgroundColor: theme === "dark" ? "#333333" : "#f8f9fa",
              color: theme === "dark" ? "#fff" : "#000",
              maxHeight: "680px",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6>Total Comments</h6>
              <span className="bg-info rounded-circle p-2">
                <HiAnnotation size="2rem" style={{ color: "#fff" }} />
              </span>
            </div>
            <p className="h4">{totalComments}</p>
            <div className="d-flex gap-2 text-sm">
              <span className="text-success">
                {lastMonthComments > 0 && <HiArrowNarrowUp />}
                {lastMonthComments}
              </span>
              <div>Last Month</div>
            </div>
          </Col>
          <Col
            lg={3}
            md={5}
            sm={12}
            className="p-3 mb-4 border rounded"
            style={{
              backgroundColor: theme === "dark" ? "#333333" : "#f8f9fa",
              color: theme === "dark" ? "#fff" : "#000",
              maxHeight: "680px",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6>Total Questions</h6>
              <span className="bg-success rounded-circle p-2">
                <HiDocumentText size="2rem" style={{ color: "#fff" }} />
              </span>
            </div>
            <p className="h4">{totalQuestions}</p>
            <div className="d-flex gap-2 text-sm">
              <span className="text-success">
                {lastMonthQuestions > 0 && <HiArrowNarrowUp />}
                {lastMonthQuestions}
              </span>
              <div>Last Month</div>
            </div>
          </Col>
        </Row>
      )}
      <Row className="justify-content-center">
        <Col md={6} sm={12} className="mb-4 ">
          <Card
            className="shadow-md border"
            bg={theme === "dark" ? "dark" : "light"}
            text={theme === "dark" ? "white" : "dark"}
          >
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h6>Recent Users</h6>
                <Button
                  variant="outline-warning"
                  as={Link}
                  to="/dashboard?tab=users"
                >
                  See all
                </Button>
              </div>
            </Card.Header>
            <Table
              striped
              bordered
              hover
              variant={theme === "dark" ? "dark" : "light"}
            >
              <thead>
                <tr>
                  <th>User Image</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "60%",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{user.username}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col md={5} sm={12} className="mb-4">
          <Card
            className="shadow-md border"
            bg={theme === "dark" ? "dark" : "light"}
            text={theme === "dark" ? "white" : "dark"}
          >
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h6>Recent Comments</h6>
                <Button
                  variant="outline-warning"
                  as={Link}
                  to="/dashboard?tab=comments"
                >
                  See all
                </Button>
              </div>
            </Card.Header>
            <Table
              striped
              bordered
              hover
              variant={theme === "dark" ? "dark" : "light"}
            >
              <thead>
                <tr>
                  <th>Comment Content</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {comments &&
                  comments.map((comment) => (
                    <tr key={comment._id}>
                      <td>{comment.content}</td>
                      <td>{comment.numberOfLikes}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col md={11} sm={11} className="mb-4">
          <Card
            className="shadow-md border"
            bg={theme === "dark" ? "dark" : "light"}
            text={theme === "dark" ? "white" : "dark"}
          >
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h6>Recent Questions</h6>
                <Button
                  variant="outline-warning"
                  as={Link}
                  to="/dashboard?tab=questions"
                >
                  See all
                </Button>
              </div>
            </Card.Header>
            <Table
              striped
              bordered
              hover
              variant={theme === "dark" ? "dark" : "light"}
            >
              <thead>
                <tr>
                  <th>question Image</th>
                  <th>question Title</th>
                  <th>question Category</th>
                </tr>
              </thead>
              <tbody>
                {questions &&
                  questions.map((question) => (
                    <tr key={question._id}>
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
                      <td>{question.title}</td>
                      <td>{question.category}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardComp;
