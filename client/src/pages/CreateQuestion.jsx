import { Form, Button, Container, Row, Col } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";

function CreateQuestion() {
  const { theme } = useSelector((state) => state.theme);
  return (
    <Container className="py-4" style={{ maxWidth: "70%" }}>
      <h1 className="text-center my-4 fw-semibold">Create a Question</h1>
      <Form>
        {/* Title and Category Row */}
        <Row className="mb-3">
          <Col sm={12} md={6} className="mb-3 mb-md-0">
            <Form.Group controlId="title">
              <Form.Control type="text" placeholder="Title" required />
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId="category">
              <Form.Select required>
                <option value="uncategorized">Select a category</option>
                <option value="category 1">category 1</option>
                <option value="category 2">category 2</option>
                <option value="category 3">category 3</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="d-flex align-items-center justify-content-between border border-2 border-warning rounded p-3 mb-3">
          <Form.Control
            type="file"
            accept="image/*"
            className="flex-grow-1 me-2"
          />
          <Button variant="outline-warning" size="sm">
            Upload Image
          </Button>
        </Form.Group>
        <Form.Group controlId="content" className="mb-4 pb-4 pb-sm-5 pb-md-4">
          <ReactQuill
            theme="snow"
            placeholder="Ask your Question..."
            required
            className={theme === "dark" ? "quill-dark" : ""}
            style={{ height: "200px" }}
          />
        </Form.Group>
        <Button type="submit" variant="warning" className="w-100">
          Publish
        </Button>
      </Form>
    </Container>
  );
}

export default CreateQuestion;
