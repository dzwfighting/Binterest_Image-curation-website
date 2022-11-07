import React, { Component } from "react";
import { gql } from "@apollo/client";
import { graphql } from "react-apollo";

const getImagesQuery = gql`
  {
    imgs {
      name
      id
    }
  }
`;

class ImageList extends Component {
  displayimgs() {
    console.log(this.props);
    var data = this.props.data;
    if (data.loading) {
      return <div>loading imgs...</div>;
    } else {
      return data.imgs.map((img) => {
        <li key={img.id}>{img.url}</li>;
      });
    }
  }
  render() {
    // console.log(this.props);
    return (
      <div>
        <ul id="image_list">{this.displayimgs}</ul>
      </div>
    );
  }
}

export default graphql(getImagesQuery)(ImageList);
