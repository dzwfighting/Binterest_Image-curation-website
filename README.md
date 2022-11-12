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

## Webpage show

### ImagesList Page

![ImagesList](https://user-images.githubusercontent.com/90535397/201450262-0b3ea9ff-ecd6-44c2-84a6-ca8a0e2cfeeb.png)

 - bottom part(can click get more to jump to nest page, click upload to upload the image by yourself)
 
 ![ImagesList_bottom](https://user-images.githubusercontent.com/90535397/201450322-52923ed4-c0da-4c7b-b8ce-36c8368baf99.png)

### Bin page

![Bin](https://user-images.githubusercontent.com/90535397/201450333-d3fa07b2-6951-4157-8419-5e3916820643.png)

### All users post images
![AllPost](https://user-images.githubusercontent.com/90535397/201450345-3d003159-190f-43e8-8c69-7478bea854e6.png)

### Popularity page(can see the top 10 popular images which was added in bin)

![popularity](https://user-images.githubusercontent.com/90535397/201450369-1f5ac686-0327-4a34-9c3c-6b1bba504266.png)

### Upload page(users upload the image they want)

![upload](https://user-images.githubusercontent.com/90535397/201450384-254e35ad-3686-4ec6-99b8-4a99f53cf538.png)
