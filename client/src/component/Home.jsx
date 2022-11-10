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
    loading: PopularityLoading,
    error: PopularityError,
    data: PopularityData,
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
      const { images } = cache.readQuery({
        query: queries.USERPOSTED,
      });
      console.log(`remove part, read images: ${images}`);
      cache.writeQuery({
        query: queries.USERPOSTED,
        data: {
          images: images.filter((e) => e.id === userData.images.id),
        },
      });
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

  const buildCard = (image) => {
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
              title="image content"
            />

            {/* </Link> */}
            {(type === "images" ||
              type === "bin" ||
              type === "my-posts" ||
              type === "popularity") && (
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
            {type === "my-posts" && (
              <Typography variant="body2" color="textSecondary" component="p">
                <Button />
              </Typography>
            )}
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  const renderCard = (getImage) => {
    // console.log(`getImage: ${getImage}`);
    let getCard = getImage.map((image) => {
      console.log(image);
      if (type === "bin") {
        if (image.binned === true) {
          return buildCard(image);
        }
      } else if (type === "allPosts") {
        if (image.userPosted === true) {
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
  }
  if (unsplashLoading || binnedLoading || userLoading || PopularityLoading) {
    return <div>Loading...</div>;
  } else if (card) {
    return (
      <div>
        <div>
          <Grid container className="classes.grid bottom" spacing={5}>
            {card}
          </Grid>
          {(type === "images" || type === "bin" || type === "my-posts") && (
            <Button className="btn btn-outline-warning" onClick={next}>
              Get More
            </Button>
          )}
          {/* {card.length === 0 && <h2>No Images</h2>} */}
        </div>
        <div>{type === "my-bin"}</div>
        <div>{type === "my-posts"}</div>
        <div>{type === "popularity"}</div>
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
