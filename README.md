# Forgerock
Forgerock 2017 submission.

This repository contains all files relevant to Andrew Summers 2017 Forgerock technical test.

## Requirements:
Node.js - https://nodejs.org/en/download/
Mysql - https://dev.mysql.com/downloads/

## Structure:

### Back-end:
The back-end functionality is achieved using a combination of basic file-system serving, express.js and a MySql database. When a user uploads a file the image itself is written to the "resources/images" directory and meta-data such as name, mimetype and size is all written to a MySql table. When the client side requests the gallery of images that have been uploaded the table is queried and the gallery can be populated with the appropriate values images and their associated meta-data.

### Front-end:
The client-side/front-end of the application is static html built using an adapted version of the bootstrap template found here:
https://startbootstrap.com/template-overviews/thumbnail-gallery/

Additionally for dynamic content changes the client-side uses the jQuery framework. Most significantly to make an AJAX call upon loading the page in order to retrieve the current gallery content.

## Install and run:

1. Download this repository and navigate to the "Forgerock" directory where you should find a package.json file.
2. Execute: "npm install" to have Node find and install all dependencies listed in package.json.
3. Ensure an instance of mysql-server is running on your system and edit the connection values in "server.js" to match your local mysql credentials.
4. At the "Forgerock" directory level execute: "node server.js" to run the server. By default the server runs on port 8000 so can be accessed via any browser at "localhost:8000".

## Acknowledgements and Improvements:
Given more time there are several areas of possible improvement:
1. Further investigation into MongoDb's GridFS system may prove more efficient in the long run, but I reverted to a personally familiar MySql solution for the purposes of this exercise.
2. The UI could be much more cleanly presented, for example clicking an image could bring out an expanded lightbox view.
3. Several smaller improvments such as presenting the file size in KB or MB could be made. 
4. Although with the size of this application the difference is negligable, using a comprehensive client-side framework as opposed to static html would be considerably more efficient compared with populating the gallery with an AJAX request made after the page has loaded.
