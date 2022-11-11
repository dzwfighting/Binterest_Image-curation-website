# Binterest_Image-curation-website

## Describe

- This is a full stack project which uses React, Apollo Client, bootstrap, JavaScript as frontend and uses Node.js, Express, Redis, GraphQL, Apollo Server to achieve backend.

## How to run

### Open redis server

- Open redis server and redis-cli

### Install and run server

- In server folder, run 'npm install'
- In server folder, run 'npm start'

### Install and run client

- In client folder, run 'npm install'
- In client folder, run 'npm start'

## Main function

### Server

- Use Express, Redis, Apollo-server to achieve cache function, fetch images data and store the user post images data.

### Client

- Use React, JavaScript, Apollo Client, bootstrap to design imagesList, userPost, bin, allPost, popularity webpages, in imagesList, users can see all images which are not posted by users and add the image they like to bin. In bin page, users can see all the images they add or delete these images from bin. In userPost page, users can upload some images by themselves, they can input the images url, description, posterName and submit the image to website. And users can see all post images they upload in allPost page. In popularity page, users can see the top 10 popular images which they add in bin.
