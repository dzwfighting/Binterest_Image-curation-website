import React from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/userPost.css";
import Error from "./Error";

const UserPost = (props) => {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [posterName, setPosterName] = useState("");
  const [posted, setPosted] = useState(undefined);
  const [uploadImage, { data, loading, error }] = useMutation(
    queries.UPLOAD_IMAGE,
    {
      onCompleted: () => {
        // console.log(data);
        setPosted(true);
        setDescription("");
        setPosterName("");
        setUrl("");
      },
    }
  );

  //   console.log(`data:${data}, loading: ${loading},error: ${error}`);

  const addPost = (e) => {
    e.preventDefault();
    console.log(
      `e:${e}, url: ${url}, posterName:${posterName},description: ${description}`
    );
    uploadImage({
      variables: {
        url,
        description,
        posterName,
      },
    });
    console.log("upload success");
  };

  if (loading) {
    // console.log(data);
    return <div>Submitting...</div>;
  } else if (posted) {
    return (
      <div className="uploadDis">
        <Alert key="success" variant="success" className="upFron">
          Upload Successful
        </Alert>

        <div className="divDis">
          <Link to="/my-posts">
            <Button variant="light" className="btn-outline-success backBtn">
              To My Posts
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <Alert key="danger" variant="danger" className="upFron">
          URL cannot be empty, please try again!
        </Alert>
        <div className="divDis">
          <Link to="/my-posts">
            <Button variant="light" className="btn-outline-success backBtn">
              To My Posts
            </Button>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="dis">
        {["light"].map((variant) => (
          <Card
            bg={variant.toLowerCase()}
            key={variant}
            text={variant.toLowerCase() === "light" ? "dark" : "white"}
            style={{ width: "30rem" }}
            className="mb-2"
          >
            <Card.Header className="size">Upload A Post</Card.Header>

            <Card.Body>
              <Form onSubmit={addPost}>
                <div className="urlDis">
                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Enter the image url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </Form.Group>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Poster Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter the image author"
                    value={posterName}
                    onChange={(e) => setPosterName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter the image description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <div className="submitBtn">
                  <Button type="submit" variant="info" className="fon">
                    Submit
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  }
};

export default UserPost;
