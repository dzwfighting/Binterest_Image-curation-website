import React from "react";
import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ImageList from "./component/ImageList";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

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
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <ApolloProvider client={client}>
        <ImageList />
      </ApolloProvider>
    </div>
  );
}

export default App;
