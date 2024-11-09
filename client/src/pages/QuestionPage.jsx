import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner, Container, Row, Col, Image } from "react-bootstrap";

function QuestionPage() {
  const { questionSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/question/getquestions?slug=${questionSlug}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        setQuestion(data.questions[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log("Error fetching question:", error.message);
      }
    };
    fetchQuestion();
  }, [questionSlug]);

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" />
      </Container>
    );

  return (
    <Container as="main" className="py-3">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1 className="display-4 text-center mb-4">
            {question && question.title}
          </h1>
          <Link to={`/search?category=${question && question.category}`}>
            <Button
              variant="secondary"
              size="sm"
              className="d-block mx-auto mb-3"
            >
              {question && question.category}
            </Button>
          </Link>
          <img
            src={question && question.image}
            alt={question && question.title}
            className="img-fluid mb-3 mx-auto d-block rounded"
          />

          <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
            <span className="d-flex align-items-center">
              {question && question.userId && (
                <>
                  <Image
                    src={question.userId.profilePicture}
                    alt={question.userId.username}
                    roundedCircle
                    width={30}
                    height={30}
                    className="me-2"
                  />
                  <span>{question.userId.username}</span>
                </>
              )}
            </span>
            <span>
              {question && new Date(question.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div
            className="question-content"
            dangerouslySetInnerHTML={{ __html: question && question.content }}
          ></div>
        </Col>
      </Row>
    </Container>
  );
}

export default QuestionPage;
