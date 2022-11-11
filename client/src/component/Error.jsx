import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import "../style/userPost.css";

const Error = () => {
  return (
    <div className="uploadDis">
      <Alert key="danger" variant="danger" className="upFron">
        Invalid Route, please try again
      </Alert>

      <div className="divDis">
        <Link to="/">
          <Button variant="light" className="btn-outline-success backBtn">
            Back to Images List
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
