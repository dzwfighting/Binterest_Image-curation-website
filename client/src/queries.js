import { gql } from "@apollo/client";

const UNSPLASH = gql`
  query UnsplashImages($pageNum: Int!) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const BINNED = gql`
  query {
    binnedImages {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const USERPOSTED = gql`
  query {
    userPostedImages {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation postImage($url: String!, $description: String, $posterName: String) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      url
      description
      posterName
    }
  }
`;

const UPDATE_IMAGE = gql`
  mutation editImage(
    $id: ID!
    $url: String
    $posterName: String
    $description: String
    $userPosted: Boolean
    $binned: Boolean
    $numBinned: Int
  ) {
    updateImage(
      id: $id
      url: $url
      description: $description
      posterName: $posterName
      userPosted: $userPosted
      binned: $binned
      numBinned: $numBinned
    ) {
      id
      url
      description
      posterName
      userPosted
      binned
      numBinned
    }
  }
`;

const DELETE_IMAGE = gql`
  mutation removeImage($id: ID!) {
    deleteImage(id: $id) {
      id
    }
  }
`;

const POPULARITY = gql`
  query {
    getTopTenBinnedPosts {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

export default {
  UNSPLASH,
  BINNED,
  USERPOSTED,
  UPLOAD_IMAGE,
  UPDATE_IMAGE,
  DELETE_IMAGE,
  POPULARITY,
};
