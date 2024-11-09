import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function CreateQuestion() {
  const { theme } = useSelector((state) => state.theme);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

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
    try {
      const res = await fetch("/api/question/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        toast.success("Question Asked!");
        navigate(`/question/${data.slug}`);
      }
    } catch (error) {
      console.log(error);
      setPublishError("Something went wrong");
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "70%" }}>
      <h1 className="text-center my-4 fw-semibold">Create a Question</h1>
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
              >
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
            onChange={(value) => setFormData({ ...formData, content: value })}
          />
        </Form.Group>
        <Button type="submit" variant="warning" className="w-100">
          Publish
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

export default CreateQuestion;
