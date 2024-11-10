import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import categories from "../categories";
import QuestionCard from "../components/QuestionCard";

function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [showMore, setShowMore] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState([]);

  const sortOptions = [
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Commented", value: "mostCommented" },
    { label: "Alphabetical", value: "alphabetical" },
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/question/getquestions?limit=8");
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
          if (data.questions.length < 8) {
            setShowMore(false);
          } else {
            setShowMore(true);
          }
        }
      } catch (error) {
        console.log("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleShowMore = async () => {
    const startIndex = questions.length;
    try {
      const res = await fetch(
        `/api/question/getquestions?startIndex=${startIndex}&limit=8`
      );
      const data = await res.json();
      if (res.ok && data.questions && data.questions.length > 0) {
        setQuestions((prev) => [...prev, ...data.questions]);
        if (data.questions.length < 8) {
          setShowMore(false);
        }
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.log("Error fetching more questions:", error);
    }
  };

  useEffect(() => {
    const filteredQuestions = filterByCategory();
    if (filteredQuestions.length >= 8) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  }, [questions, selectedCategory]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = {};
      for (const question of questions) {
        try {
          const res = await fetch(
            `/api/comment/getQuestionComments/${question._id}`
          );
          if (res.ok) {
            const data = await res.json();
            commentsData[question._id] = data;
          }
        } catch (error) {
          console.log(
            `Error fetching comments for question ${question._id}:`,
            error
          );
        }
      }
      setComments(commentsData);
    };

    if (questions.length) {
      fetchComments();
    }
  }, [questions]);

  const handleCategoryToggle = (category) => {
    setSelectedCategory((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((cat) => cat !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const filterByCategory = () => {
    return selectedCategory.length
      ? questions.filter((q) => selectedCategory.includes(q.category))
      : questions;
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "grid" ? "column" : "grid"));
  };

  const sortQuestions = (option) => {
    const sortedQuestions = [...questions];
    switch (option) {
      case "latest":
        sortedQuestions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        sortedQuestions.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "mostCommented":
        sortedQuestions.sort(
          (a, b) =>
            (comments[b._id]?.length || 0) - (comments[a._id]?.length || 0)
        );
        break;
      case "alphabetical":
        sortedQuestions.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    setQuestions(sortedQuestions);
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
    sortQuestions(option);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Container className="my-5">
        <Row className="mb-4">
          <Col lg={6} md={6}>
            <h1 className="display-4 text-warning fw-bold">Ask!</h1>
            <p className="fs-5">
              Welcome to a community where curiosity thrives! Whether you're
              looking for answers or eager to share your knowledge, ASK connects
              people through insightful questions and discussions. Discover,
              learn, and engage with others, all in one place.
            </p>
          </Col>
        </Row>
        <hr />
        <div className="d-flex justify-content-end mb-3 gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              Categories
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {categories.map((category) => (
                <Dropdown.Item
                  key={category}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCategoryToggle(category);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategory.includes(category)}
                    className="me-2"
                    name="category"
                    onChange={() => handleCategoryToggle(category)}
                  />
                  {category}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">Sort</Dropdown.Toggle>
            <Dropdown.Menu>
              {sortOptions.map((option) => (
                <Dropdown.Item
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                >
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>{" "}
          <Button variant="outline-secondary" onClick={toggleViewMode}>
            {viewMode === "grid" ? (
              <CiGrid41 size={24} />
            ) : (
              <CiGrid2H size={24} />
            )}
          </Button>
        </div>
        <Row className={`gy-4 ${viewMode === "grid" ? "" : "flex-column"}`}>
          {filterByCategory().map((question) => (
            <Col
              key={question._id}
              xs={12}
              sm={viewMode === "grid" ? 6 : 12}
              md={viewMode === "grid" ? 4 : 12}
              lg={viewMode === "grid" ? 3 : 12}
            >
              <QuestionCard
                question={question}
                questionId={question._id}
                comments={comments[question._id] || []}
              />
            </Col>
          ))}
        </Row>
        {showMore && (
          <div className="text-center mt-5">
            <Button variant="outline-warning" onClick={handleShowMore}>
              Show More
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Home;
