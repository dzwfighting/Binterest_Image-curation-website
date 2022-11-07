import React from "react";
import { useState } from "react";
import { Routes, Route, BrowserRouter, Router, Link } from "react-router-dom";
import logo from "./img/tiger.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import ImageList from "./component/ImageList";
import Home from "./component/Home";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import Navigation from "./component/Navigation";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />

      <ApolloProvider client={client}>
        {/* <ImageList /> */}
        <h1>Binterest</h1>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigation />}></Route>
            <Route exact path="/" element={<Home type={"imagesList"} />}>
              All Images List
            </Route>

            <Route exact path="/my-bin" element={<Home type={"bin"} />}>
              Bin
            </Route>

            <Route exact path="/my-posts" element={<Home type={"allPosts"} />}>
              All Upload images
            </Route>

            <Route exact path="/new-post" element={<Home type={"posts"} />}>
              Upload posts
            </Route>

            <Route
              exact
              path="/popularity"
              element={<Home type={"popularity"} />}
            >
              Popularity
            </Route>
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </div>
  );
}

export default App;
