const express = require("express");
const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
const uuid = require("uuid");
const redis = require("redis");
const bluebird = require("bluebird");
const client = redis.createClient();

// It’ll add a Async to all node_redis functions (e.g. return client.getAsync().then())
const cors = require("cors");
// let express to connectgraphQL
// const graphqlHTTP = require("express-graphql").graphqlHTTP;
// const schema = require("./schema/schema");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", function (err) {
  console.error("Oh, something wrong when connect to redis", err);
  process.exit();
});

const app = express();

app.use(cors());

// let express handle the graphQL data, by passing graphQL schema
// app.use(
//   "/",
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   })
// );

/*
const URL = "https://api.unsplash.com/photos/?client_id=zTflS14263ZfZA5SifiGuz5ez1bax5aIlHzlpq8yK7g"
const { data } = await axios.get(URL)
// console.log(data[0].user)

const typeDefs = `
    #graphql
    type image {
        id: ID!
        url: String!
        posterName: String!
        description: String
        userPosted: Boolean!
        binned: Boolean!
    }

    type Query {
        imgs: [image]
    }
`;


let i = 0
const imgs = []
while (i < data.length) {
    imgs.push(
        {
            id: `${data[i].user.id}`,
            url: `${data[i].user.profile_image.medium}`,
            posterName: `${data[i].user.name}`,
            description: `${data[i].user.bio}`,
            userPosted: true,
            binned: false
        }
        
    )
    i ++
}
console.log(imgs)


const resolvers = {
    Query: {
        imgs: ()=> imgs
    }
}

*/
const typeDefs = gql`
  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
    getTopTenBinnedPosts: [ImagePost]
  }

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned: Int!
  }

  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost

    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
      numBinned: Int
    ): ImagePost

    deleteImage(id: ID!): ImagePost
  }
`;

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {
      try {
        const { data } = await axios.get(
          `https://api.unsplash.com/photos/?client_id=zTflS14263ZfZA5SifiGuz5ez1bax5aIlHzlpq8yK7g&page=${args.pageNum}`
        );
        console.log(data);
        const imageList = [];
        for (let i = 0; i < data.length; i += 1) {
          const cache = await client.getAsync(data[i].id);
          console.log(`cache: ${cache}`);
          let binned = false;
          if (cache) {
            binned = true;
          }
          let image = {
            id: data[i].id,
            url: data[i].urls.regular,
            posterName: data[i].posterName,
            userPosted: false,
            binned: binned,
          };
          imageList.push(image);
        }
        // console.log(imageList);
        return imageList;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    binnedImages: async () => {
      try {
        let checkBinned = await client
          .lrangeAsync("binned", 0, -1)
          .map(JSON.parse)
          .filter((value) => value.binned === true);
        return checkBinned;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    userPostedImages: async () => {
      try {
        let userPostedI = await client
          .lrangeAsync("userPosted", 0, -1)
          .map(JSON.parse)
          .filter((value) => value.userPosted === true);

        return userPostedI;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    getTopTenBinnedPosts: async () => {
      try {
        let numBinnedData = await client
          .zrevrangebyscoreAsync("num", "+inf", "-inf")
          .map(JSON.parse);
        if (numBinnedData) {
          return numBinnedData.slice(0, 10);
        }
        return numBinnedData;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },
  },

  Mutation: {
    uploadImage: async (_, args) => {
      try {
        if (!args.url) {
          throw Error("Please input URL");
        }
        const userPost = {
          id: uuid.v4(),
          url: args.url,
          description: args.description,
          posterName: args.posterName,
          binned: false,
          userPosted: true,
          numBinned: 0,
        };
        await client.setAsync(userPost.id, JSON.stringify(userPost));
        await client.lpushAsync("userPosted", JSON.stringify(userPost));
        return userPost;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    updateImage: async (_, args) => {
      try {
        if (!args.id) {
          throw Error("Please input a id");
        }
        const cache = JSON.parse(await client.getAsync(args.id));
        console.log(
          `update cache:${cache},cache.userPosted:${cache.userPosted}`
        );

        const userPost = {
          id: args.id,
          url: cache ? cache.url : args.url,
          description: cache ? cache.description : args.description,
          posterName: cache ? cache.posterName : args.posterName,
          binned: cache ? cache.binned : args.binned,
          userPosted: cache ? cache.userPosted : args.userPosted,
          numBinned: cache ? cache.numBinned : args.numBinned,
        };
        const convertToString = JSON.stringify(userPost);
        // const cache = JSON.parse(await client.getAsync(args.id));
        // console.log(`updateImage cache: ${cache}, args.binned:${args.binned}`);

        if (userPost.binned) {
          console.log("userPost.binned exist");
          await client.lremAsync("binned", 0, JSON.stringify(cache));
          await client.lpushAsync("binned", 0, convertToString);
          await client.setAsync(args.id, convertToString);
          await client.zaddAsync("num", userPost.numBinned, convertToString);
        } else {
          console.log("userPost.binned not exist");
          await client.lremAsync("binned", 0, JSON.stringify(cache));
          await client.delAsync(args.id);
          await client.zremAsync("num", JSON.stringify(cache));
        }

        if (userPost.userPosted) {
          console.log("userPost.userPosted exist");
          await client.lremAsync("userPosted", 0, JSON.stringify(cache));
          await client.lpushAsync("userPosted", 0, convertToString);
          await client.setAsync(args.id, convertToString);
        } else {
          console.log("userPost.userPosted not exist");
          await client.lremAsync("userPosted", 0, JSON.stringify(cache));
        }
        console.log(userPost);
        return userPost;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    deleteImage: async (_, args) => {
      try {
        let image = JSON.parse(await client.getAsync(args.id));
        // console.log(image);
        await client.lremAsync("userPosted", 0, JSON.stringify(image));
        await client.lremAsync("binned", 0, JSON.stringify(image));
        await client.delAsync(args.id);
        await client.zremAsync("num", JSON.stringify(image));
        return image;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
// app.listen(4000, () => {
//   console.log("🚀  Server ready at: http://localhost:4000");
// });
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
// console.log(`🚀  Server ready at: ${url}`)
