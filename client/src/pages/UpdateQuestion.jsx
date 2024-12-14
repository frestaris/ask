import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { toast } from "react-toastify";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getBaseUrl } from "../utils/baseUrl";

function UpdateQuestion() {
  const { theme } = useSelector((state) => state.theme);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const { questionId } = useParams();

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await fetch(
        `${getBaseUrl()}/api/question/getquestions?questionId=${questionId}`
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        setFormData(data.questions[0]);
      }
    };
    fetchQuestion();
  }, [questionId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadUrl });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionId || !currentUser) {
      setPublishError("Invalid question ID or user");
      return;
    }
    try {
      const res = await fetch(
        `${getBaseUrl()}/api/question/updatequestion/${formData._id}/${
          currentUser._id
        }`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/question/${data.slug}`);
    } catch (error) {
      console.log(error.message);
      setPublishError("Something went wrong updating the question");
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "70%" }}>
      <h1 className="text-center my-4 fw-semibold">Update Question</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col sm={12} md={6} className="mb-3 mb-md-0">
            <Form.Group controlId="title">
              <Form.Control
                type="text"
                placeholder="Title"
                required
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                value={formData.title}
              />
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId="category">
              <Form.Select
                required
                className="form-select"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                value={formData.category}
              >
                <option value="uncategorized">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Science">Science</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Sports">Sports</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Lifestyle">Lifestyle</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="d-flex align-items-center justify-content-between border border-2 border-warning rounded p-3 mb-3">
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-grow-1 me-2"
          />
          <Button
            variant="outline-warning"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div style={{ width: "64px", height: "64px" }}>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </Form.Group>
        {imageUploadError && <Alert variant="danger">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="img-fluid my-2"
            style={{ height: "288px", width: "100%", objectFit: "contain" }}
          />
        )}
        <Form.Group controlId="content" className="mb-4 pb-4 pb-sm-5 pb-md-4">
          <ReactQuill
            theme="snow"
            placeholder="Ask your Question..."
            required
            className={theme === "dark" ? "quill-dark" : ""}
            style={{ height: "200px" }}
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
          />
        </Form.Group>
        <Button type="submit" variant="warning" className="w-100">
          Update question
        </Button>
        {publishError && (
          <Alert className="mt-1" variant="danger">
            {publishError}
          </Alert>
        )}
      </Form>
    </Container>
  );
}

export default UpdateQuestion;
