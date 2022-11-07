import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../style/navigation.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Navigation = () => {
  return (
    <div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/">
          All Images List
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/my-bin">
          Bin
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/my-posts">
          All Upload images
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/new-post">
          Upload posts
        </Link>
      </div>
      <div className="link_margin">
        <Link className="App-link btn btn-outline-success" to="/popularity">
          Popularity
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
