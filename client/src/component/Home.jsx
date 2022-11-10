import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import axios from "axios";
import Error from "./Error";
import queries from "../queries";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/home.css";
import noImage from "../img/download.jpeg";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    maxWidth: 270,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "2px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    // fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});

const Home = (props) => {
  const type = props.type;
  // console.log(type);
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [pageNum, setPageNum] = useState(1);
  // const [errorCode, setErrorCode] = useState(undefined);
  // const [errorPage, setErrorPage] = useState(false);

  let totalCount = 0;
  let card = null;
  const navigate = useNavigate();

  const next = async () => {
    setPageNum(pageNum + 1);
  };

  // fetch unsplash images data

  const {
    loading: unsplashLoading,
    error: unsplashError,
    data: unsplashData,
  } = useQuery(queries.UNSPLASH, {
    fetchPolicy: "cache-and-network",
    variables: {
      pageNum: pageNum,
    },
  });
  // console.log(unsplashData, unsplashLoading, unsplashError);

  // fetch userposts images data
  const { loading: userLoading, error: userError, data: userData } = useQuery(
    queries.USERPOSTED,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  // fetch binned data
  const {
    loading: binnedLoading,
    error: binnedError,
    data: binnedData,
  } = useQuery(queries.BINNED, {
    fetchPolicy: "cache-and-network",
  });

  // get popularity data
  const {
    loading: popularityLoading,
    error: popularityError,
    data: popularityData,
  } = useQuery(queries.POPULARITY, {
    fetchPolicy: "cache-and-network",
  });

  const [updateImage] = useMutation(queries.UPDATE_IMAGE);
  const updateData = (image) => {
    console.log(`updateData before: ${image.binned}`);
    updateImage({
      variables: {
        id: image.id,
        url: image.url,
        posterName: image.posterName,
        description: image.description,
        userPosted: image.userPosted,
        binned: !image.binned,
        numBinned: image.numBinned,
      },
    });
    // console.log(`updateData after: ${image.binned}`);
  };

  // achieve delete a image
  const [removeImage] = useMutation(queries.DELETE_IMAGE, {
    update(cache) {
      console.log(`del userPost ${cache}`);
      const { images } = cache.readQuery({
        query: queries.USERPOSTED,
      });
      console.log(`remove part, read images: ${images}`);
      if (images) {
        cache.writeQuery({
          query: queries.USERPOSTED,
          data: {
            images: images.filter((e) => e.id === userData.images.id),
          },
        });
      }
    },
  });

  const binButton = (image) => {
    console.log(image);
    updateData(image);
  };
  const delBin = (image) => {
    console.log(image);
    updateData(image);
  };

  const delPost = (image) => {
    console.log(image);
    try {
      removeImage({
        variables: {
          id: image.id,
        },
      });
    } catch (error) {
      throw Error(error.message);
    }
    navigate("/");
  };

  const buildCard = (image) => {
    if (!image) {
      return <div></div>;
    }
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={image.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <CardContent>
              <Typography
                className={classes.titleHead}
                gutterBottom
                variant="h6"
                component="h3"
              >
                description: {image.description ? image.description : "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Poster Name: {image.posterName ? image.posterName : "N/A "}
              </Typography>
            </CardContent>
            {/* <Link to={`/${props.type}/${image.id}`}> */}
            <CardMedia
              className={classes.media}
              component="img"
              image={image.url ? image.url : noImage}
              title="No Image"
            />

            {/* </Link> */}
          </CardActionArea>
          {(type === "images" || type === "bin" || type === "popularity") && (
            <Typography variant="body2" color="textSecondary" component="p">
              {image.binned ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    delBin(image);
                  }}
                >
                  Delete from bin
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    binButton(image);
                  }}
                >
                  add to Bin
                </Button>
              )}
            </Typography>
          )}

          {type === "allPosts" && image.userPosted && (
            <Typography variant="body2" color="textSecondary" component="p">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  delPost(image);
                }}
              >
                Delete Post
              </Button>
            </Typography>
          )}
        </Card>
      </Grid>
    );
  };

  const renderCard = (getImage) => {
    // console.log(`renderCard imageData: ${getImage}`);
    if (type === "popularity") {
      // console.log(getCard);

      let getCard = getImage.getTopTenBinnedPosts.map((image) => {
        if (image.binned === true) {
          return buildCard(image);
        }
      });
      return getCard;
    }
    let getCard = getImage.map((image) => {
      // console.log(image);
      if (type === "bin") {
        if (image.binned === true) {
          return buildCard(image);
        }
      } else if (type === "allPosts") {
        if (image && image.userPosted === true) {
          return buildCard(image);
        }
      } else {
        return buildCard(image);
      }
    });
    return getCard;
  };
  if (type === "images" && !unsplashLoading) {
    // console.log(`type: images, render card: ${unsplashData}`);
    console.log(unsplashData.unsplashImages);
    card = renderCard(unsplashData.unsplashImages);
  } else if (type === "bin" && !binnedLoading) {
    console.log(`binnedData: ${binnedData}`);
    card = renderCard(binnedData.binnedImages);
  } else if (type === "allPosts" && !userLoading) {
    console.log(userData);
    card = renderCard(userData.userPostedImages);
  } else if (type === "popularity" && !popularityLoading) {
    console.log(popularityData);
    card = renderCard(popularityData);
  }
  if (unsplashLoading || binnedLoading || userLoading || popularityLoading) {
    return <div>Loading...</div>;
  } else if (card) {
    return (
      <div>
        <div>
          {card ? (
            <Grid container className="classes.grid bottom" spacing={5}>
              {card}
            </Grid>
          ) : (
            <div>
              <br />
            </div>
          )}

          {(type === "images" ||
            type === "bin" ||
            type === "allPosts" ||
            type === "popularity") && (
            <Button className="btn btn-outline-warning" onClick={next}>
              Get More
            </Button>
          )}
          {/* {card.length === 0 && <h2>No Images</h2>} */}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {type === "images" && unsplashError && (
          <div>
            <Error />
          </div>
        )}
      </div>
    );
  }
};

export default Home;
