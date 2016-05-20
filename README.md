Photo Gallery
======================

A photo gallery that has ability to search photos using defined api 
, renders endless scroll of photos on the page, and shows detailed image in a light box experience

## Getting Started

### Local machine (Mac)

#### Environment Setup:

    ``` bash
    # install homebrew
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    # install node js (>= 0.12 version)
    brew install nodejs
    # install required packages
    npm install
    # build js file
    npm run build
    # start node js server (host locally at http://localhost:3030/)
    npm start
    ```

### Command Sheet

| Commands                  | Description |
| ------------------------- | ----------- |
| `npm run build  `         | Builds the photogallery.js file |
| `npm start`               | Host the index.html at http://localhost:3030/ |
| `npm test`                | Run unit test |

### Design

##### PhotoGallery
This class is the API layer to the client.  Search and nextPage are the methods available
to the client

##### PhotoGalleryMediator
Mediator directs traffic between all the internal modules (Mediator Design Pattern)

##### APIManager (Currently using Flickr API)
API manager will iterate the current 'installed' apis. (Strategy Design Pattern)
The 'installed' api classes are required to implement two methods
(1) search (2) imageDataGenerator.  This makes it easy to add multiple
vendors' API in the future

##### LoadManager
Load manager handles all the network call (api endpoint) with xhr and also detects network error
and gives warning

##### DataManager
Data manager saves current fetched api data and process it into defined image model schema

##### ViewManager
View manager is in charge of building and rendering view in dom level.  Using DocumentFragment for appending
the thumbnail image wall efficiently

#### LightBoxManager
LightBoxManager renders detailed photo in lightbox experience.  Using image cache to avoid multiple network calls on the same photo.  Keeps a maximum number of photos in the cache and calculate which photo to pop from the cache
depends on users' navigation on the photos

### Browser Support
Tested on Chrome:50.0.2661.102 Safari:9.0.3 FireFox: 46.0.1 IE Edge:25.10586.0.0