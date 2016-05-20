require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var imageDataModel = require('./imageDataModel');

/**
* Data manager saves current fetched api data
* in form of imageDataModel
* @param {PhotoGalleryMediator} mediator
* @class
*/
function DataManager (mediator) {
    var self = this;
    self._imageData = [];
    self._mediator = mediator;
    self._startImageDataIndex = 0;
}

/**
* Add new data into current data array
* @param {object} resp - response object
* @param {appendCallback} callback - A callback to build image data
* @public
*/
DataManager.prototype.append = function (resp, cb) {
    var self = this;
    var imageData = cb(resp, imageDataModel);

    for (var i = 0; i < imageData.length; i++) {
        self._imageData.push(imageData[i]);
    }
    self._mediator._viewManager.append(self._imageData, self._startImageDataIndex);
    self._startImageDataIndex = self._imageData.length;
};

/**
* Clear image data array and reset the starting image index
* @public
*/
DataManager.prototype.destroy = function () {
    var self = this;
    self._imageData = [];
    self._startImageDataIndex = 0;
};

module.exports = DataManager;

},{"./imageDataModel":2}],2:[function(require,module,exports){
'use strict';

/**
* Image data model schema
*/
var imageModelSchema = {
    title: '',
    imageSrc: '',
    thumbSrc: ''
};

exports.imageDataModel = imageModelSchema;
},{}],3:[function(require,module,exports){
'use strict';

var APIManager = require('./service/api-manager');
var LoadManager = require('./service/load-manager');
var DataManager = require('./model/data-manager');
var ViewManager = require('./view/view-manager');

/**
* Mediator between all the internal modules (Mediator Design Pattern)
* @param {PhotoGallery} photogallery
* @param {HTMLElement} selector
* @class
*/
function PhotoGalleryMediator (photogallery, selector) {
    var self = this;
    self._photogallery = photogallery;
    self._apiManager = new APIManager(self);
    self._dataManager = new DataManager(self);
    self._viewManager = new ViewManager(self, selector);
    self._loadManager = new LoadManager(self);
}

/**
* Fetch meta data of photos from the image api
* @param {string} keyword
* @public
*/
PhotoGalleryMediator.prototype.search = function (keyword) {
    var self = this;
    self._apiManager.search(keyword);
};

/**
* Clear all the previous image data and view data
* @public
*/
PhotoGalleryMediator.prototype.clear = function () {
    var self = this;
    self._dataManager.destroy();
    self._viewManager.clearImageView();
};

/**
* Destroy all the data and related dom nodes
* @public
*/
PhotoGalleryMediator.prototype.destroy = function () {
    var self = this;
    self._apiManager.destroy();
    self._dataManager.destroy();
    self._viewManager.destroy();
    self._loadManager.destroy();
    self._photogallery = null;
    self._apiManager = null;
    self._dataManager = null;
    self._viewManager = null;
    self._loadManager = null;
};

module.exports = PhotoGalleryMediator;

},{"./model/data-manager":1,"./service/api-manager":4,"./service/load-manager":6,"./view/view-manager":8}],4:[function(require,module,exports){
'use strict';
var APIS = require('./api/api');

/**
* API manager will iterate the current 'installed' apis. (Strategy Design Pattern)
* The 'installed' api classes are required to implement two methods
* (1) search (2) imageDataGenerator.  This makes it easy to add multiple
* vendors' API in the future
* @param {PhotoGalleryMediator} mediator
* @public
* @class
*/
function APIManager (mediator) {
    var self = this;
    self._apis = [];
    self._apis.push(new APIS.FlickrAPI());
    self._mediator = mediator;
}
/**
* Fetch meta data of photos from the image api
* @param {string} keyword
* @public
*/
APIManager.prototype.search = function (keyword) {
    var self = this;
    self._apis.forEach(function (api) {
        var reqObj = api.search(keyword);
        var url = self._mediator._loadManager.buildUrl(api._url, reqObj);
        console.log(url);
        self._mediator._loadManager.load(url, api.imageDataGenerator);
    });
};

/**
* Destroy API Manager
* @public
*/
APIManager.prototype.destroy = function () {
    var self = this;
    self._apis = [];
    self._mediator = null;
};

module.exports = APIManager;

},{"./api/api":5}],5:[function(require,module,exports){
'use strict';

/**
* Installed vendor's API class.  Each vendor api class is required
* to implement two methods (1) search (2) imageDataGenerator (callback)
* @class
*/
function FlickrAPI () {
    var self = this;
    self._url = 'https://api.flickr.com/services/rest/';
    self._apiKey = '255a43d745050cc6ce42d84effb35f96';
    self._reqObj = {
                        method: 'flickr.photos.search',
                        api_key: self._apiKey,
                        text: '',
                        format: 'json',
                        nojsoncallback: 1,
                        page: 0
                    };
};

/**
* Fetch meta data of photos from the image api
* @param {string} keyword
* @returns {object} request object
* @public
*/
FlickrAPI.prototype.search = function (keyword) {
    var self = this;
    if (self._reqObj.text === keyword) {
        self._reqObj.page++;
    } else {
        self._reqObj.text = keyword;
        self._reqObj.page = 1;
    }
    return self._reqObj;
};

/**
* Callback function that generates image data into our imageDataModel schema
* @param {object} data
* @param {object} imageDataModel
* @returns {object} imageData
* @public
*/
FlickrAPI.prototype.imageDataGenerator = function (data, imageDataModel) {
    var self = this;
    var photoData = data.photos, photos = photoData.photo;
    var base_url, image_url, thumb_url;
    var imageData = [];

    for (var i = 0; i < photos.length; i++) {
        if (photos[i] && Object.keys(photos[i]).length > 0) {
            base_url = 'https://farm' + photos[i].farm + '.staticflickr.com/' + 
                        photos[i].server + '/' + photos[i].id + '_' + photos[i].secret;
            image_url = base_url + '_z.jpg';
            thumb_url = base_url + '_q.jpg';
            
            var newImageData = JSON.parse(JSON.stringify(imageDataModel));
            newImageData.title = photos[i].title;
            newImageData.imageSrc = image_url;
            newImageData.thumbSrc = thumb_url;
            imageData.push(newImageData);
        }
    }
    return imageData;
};

module.exports.FlickrAPI = FlickrAPI;

},{}],6:[function(require,module,exports){
/* global window */
'use strict';

/**
* Load manager calls api endpoint with xhr
* @param {PhotoGalleryMediator} mediator
* @class
*/
function LoadManager (mediator) {
    var self = this;
    self._mediator = mediator;
    self._xhr = new window.XMLHttpRequest();
}

/**
* Makes api call
* @param {string} url
* @param {loadCallback} callback - A callback to build image data
* @public
*/
LoadManager.prototype.load = function (url, cb) {
    var self = this;
    self._xhr.onreadystatechange = function () {
        if (self._xhr.status && self._xhr.status < 200 || self._xhr.status >= 300) {
            self._mediator._viewManager.showWarning('No data available!', 2);
        }
        if (self._xhr.status && self._xhr.readyState == 4 && self._xhr.status == 200) {
            var respObj = JSON.parse(self._xhr.responseText);
            self._mediator._dataManager.append(respObj, cb);
            self._mediator._viewManager.hideLoadingBar();
        }
    };
    self._xhr.open('GET', url, true);
    self._xhr.send();
    self._mediator._viewManager.showLoadingBar();
};

/**
* Builds api end point
* @param {string} url
* @param {object} parameters - request parameters object
* @public
*/
LoadManager.prototype.buildUrl = function (url, parameters) {
    var qs = '';
    for (var key in parameters) {
        qs += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1);
        url = url + '?' + qs;
    }
    return url;
};

/**
* Destroy LoadManager
* @public
*/
LoadManager.prototype.destroy = function () {
    var self = this;
    self._mediator = null;
    self._xhr = null;
};

module.exports = LoadManager;

},{}],7:[function(require,module,exports){
/* globals window */
/* globals document */
'use strict';

/**
* LightBoxManager is in charge of rendering detailed
* photo in lightbox experience
* @param {HTMLElement} selector
* @param {ViewManager} viewManager
* @class
*/
function LightBoxManager (selector, viewManager) {
    var self = this;

    self._selector = selector;
    self._viewManager = viewManager;
    self._document = window.document;
    self._whiteOverlay = null;
    self._blackOverlay = null;
    self._nextNav = null;
    self._prevNav = null;
    self._titleBar = null;
    self._currentViewingImageIndex = -1;
    self._lightBoxImageMap = {};
    // each detailed image is about 120KB
    // 200 will be taking around 24MB space
    self.LIGHTBOX_MAX_CACHE_SIZE = 200;
    self.init();
}

/**
* Initializes LightBoxManager, building required
* dom node
* @public
*/
LightBoxManager.prototype.init = function () {
    var self = this;
    self._whiteOverlay = self._createWhiteOverlay();
    self._blackOverlay = self._createBlackOverlay();
    self._nextNav = self._createNextNav();
    self._prevNav = self._createPrevNav();
    self._titleBar = self._createTitleBar();

    self._selector.appendChild(self._whiteOverlay);
    self._selector.appendChild(self._blackOverlay);
    self._selector.appendChild(self._nextNav);
    self._selector.appendChild(self._prevNav);
    self._selector.appendChild(self._titleBar);

};

/**
* Creates next photo nav
* @private
*/
LightBoxManager.prototype._createNextNav = function () {
    var self = this;
    if (self._nextNav) {
        return;
    }
    var nextNav = self._document.createElement('div');
    nextNav.className = 'next_arrow';
    nextNav.onclick = self._navToNextPhoto.bind(this);
    return nextNav;
};

/**
* Creates previous photo nav
* @private
*/
LightBoxManager.prototype._createPrevNav = function () {
    var self = this;
    if (self._prevNav) {
        return;
    }
    var prevNav = self._document.createElement('div');
    prevNav.className = 'prev_arrow';
    prevNav.onclick = self._navToPrevPhoto.bind(this);
    return prevNav;
};

/**
* Creates title bar
* @private
*/
LightBoxManager.prototype._createTitleBar = function () {
    var self = this;
    if (self._titleBar) {
        return;
    }
    var titleBar = self._document.createElement('div');
    titleBar.className = 'title_bar';

    return titleBar;
};

/**
* Creates white overlay
* @private
*/
LightBoxManager.prototype._createWhiteOverlay = function () {
    var self = this;
    if (self._whiteOverlay) {
        return;
    }
    var whiteOverylay = self._document.createElement('div');
    whiteOverylay.className = 'white_content';

    return whiteOverylay;
};

/**
* Creates black overlay
* @private
*/
LightBoxManager.prototype._createBlackOverlay = function () {
    var self = this;
    if (self._blackOverlay) {
        return;
    }
    var blackOverlay = self._document.createElement('div');
    blackOverlay.className = 'black_overlay';

    return blackOverlay;
};

/**
* Navigate to next photo
* @private
*/
LightBoxManager.prototype._navToNextPhoto = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    var event = args[0];

    event.preventDefault();
    event.stopPropagation();

    if (self._currentViewingImageIndex < 0) {
        return;
    }
    var linkNode = self._viewManager._imageViewData[++self._currentViewingImageIndex];
    self.render(linkNode);
};

/**
* Navigate to prev photo
* @private
*/
LightBoxManager.prototype._navToPrevPhoto = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    var event = args[0];

    event.preventDefault();
    event.stopPropagation();

    if (self._currentViewingImageIndex < 0) {
        return;
    }
    if (self._currentViewingImageIndex - 1 < 0) {
        hidePrevNav
        return;
    }
    var linkNode = self._viewManager._imageViewData[--self._currentViewingImageIndex];
    self.render(linkNode);
};

/**
* Detach current photo in the lightbox
* @private
*/
LightBoxManager.prototype._detachImageFromLightBox = function () {
    var self = this;
    var child = self._whiteOverlay.firstChild;
    if (child) {
        self._whiteOverlay.removeChild(child);
    }
};

/**
* Enable prev and next photo navigation
* @private
*/
LightBoxManager.prototype._enableNavigation = function () {
    var self = this;

    if (self._currentViewingImageIndex === 0) {
        self._prevNav.style.display = 'none';
    } else {
        self._prevNav.style.display = 'block';
    }

    if (self._currentViewingImageIndex ===
        self._viewManager._imageViewData.length - 1) {
        self._nextNav.style.display = 'none';
    } else {
        self._nextNav.style.display = 'block';
    }
};

/**
* Render detailed photo in lightbox
* @param {HTMLElement} linkNode
* @public
*/
LightBoxManager.prototype.render = function (linkNode) {
    var self = this;
    if (!self._selector.children[0] || !linkNode) {
        return;
    }

    self._detachImageFromLightBox();
    var img;

    if (linkNode.firstChild) {
        self._currentViewingImageIndex = parseInt(linkNode.firstChild.getAttribute('data-index'));
    }

    if (self._lightBoxImageMap[self._currentViewingImageIndex]) {
        // we've already visited this image before, just append it, no creation and fetching
        img = self._lightBoxImageMap[self._currentViewingImageIndex];
        self._whiteOverlay.appendChild(img);
        self._turnOnLightBox(img);
        return;
    }

    img = self._document.createElement('img');
    img.src = linkNode.href;
    img.alt = linkNode.firstChild ? linkNode.firstChild.alt : '';

    img.onload = self._imgOnLoadCallBack.bind(self, img);
    self._viewManager.showLoadingBar();
    // save img node to map, so we don't have to fetch again if user clicks on the same image
    self._addToLightBoxImageMap(self._currentViewingImageIndex, img);
    self._whiteOverlay.appendChild(img);
};

/**
* Add image element to lightbox map and maintain the LIGHTBOX_MAX_CACHE_SIZE
* @param {string} index
* @param {HTMLElement} imgNode
* @private
*/
LightBoxManager.prototype._addToLightBoxImageMap = function (index, img) {
    var self = this;
    var len = Object.keys(self._lightBoxImageMap).length;
    // get current startIndex and endIndex (both ends) in the current cache
    var startIndex = Object.keys(self._lightBoxImageMap)[0];
    var endIndex = Object.keys(self._lightBoxImageMap)[len - 1];

    // compare to see the new index is close to startIndex or endIndex
    // we will remove one of the ends that is further away from the new index when
    // we reach the max cache size
    if (len + 1 > self.LIGHTBOX_MAX_CACHE_SIZE) {
        if (Math.abs(index - startIndex) > Math.abs(endIndex - index)) {
            delete self._lightBoxImageMap[startIndex];
        } else {
            delete self._lightBoxImageMap[endIndex];
        }
    }
    self._lightBoxImageMap[index] = img;
};

/**
* Enable and adjust lightbox once the image is downloaded
* @param {HTMLElement} imgNode
* @private
*/
LightBoxManager.prototype._turnOnLightBox = function (imgNode) {
    var self = this;
    // adjust the size on whiteOverlay
    self._whiteOverlay.setAttribute('style', 'top: 50%; left: 50%; width: ' + imgNode.width +
                              '; height: ' + imgNode.height + '; margin-top: ' +
                              (-parseInt(imgNode.height / 2) + window.scrollY) + '; margin-left: ' +
                              -parseInt(imgNode.width / 2) + '; opacity: 1;');

    self._titleBar.setAttribute('style', 'top: 50%; left: 50%; width: ' + imgNode.width +
                              '; height: ' + 20 + '; margin-top: ' +
                              (-parseInt(imgNode.height / 2) + window.scrollY + imgNode.height) + '; margin-left: ' +
                              -parseInt(imgNode.width / 2) + ';');
    // set the title
    self._titleBar.innerHTML = imgNode.alt;
    self._blackOverlay.setAttribute('style', 'margin-top: ' + scrollY + ';');
    self._nextNav.setAttribute('style', 'margin-top: ' + scrollY + ';');
    self._prevNav.setAttribute('style', 'margin-top: ' + scrollY + ';');
    self._viewManager.hideLoadingBar();
    // turn on both whiteOverlay and blackOverlay
    self._whiteOverlay.style.display = 'block';
    self._blackOverlay.style.display = 'block';
    self._enableNavigation();
    self._titleBar.style.display = 'block';
    // lock the scroll
    self._document.body.style.overflow = 'hidden';
}

/**
* Remove lightbox effect
* @param {HTMLElement} imgNode
* @private
*/
LightBoxManager.prototype._turnOffLightBox = function () {
    var self = this;
    // enable the scroll
    self._document.body.style.overflow = 'auto';
    // turn off both whiteOverlay and blackOverlay
    self._whiteOverlay.style.display = 'none';
    self._blackOverlay.style.display = 'none';
    self._nextNav.style.display = 'none';
    self._prevNav.style.display = 'none';
    self._titleBar.style.display = 'none';
    self._detachImageFromLightBox();
}

/**
* Turn on the light box once image finished loading
* @public
*/
LightBoxManager.prototype._imgOnLoadCallBack = function () {
    var self = this;

    var args = Array.prototype.slice.call(arguments);
    var imgNode = args[0];

    if (imgNode.complete || imgNode.height && imgNode.height > 0) {
        self._turnOnLightBox(imgNode);
        self._blackOverlay.onclick = self._turnOffLightBox.bind(this);
    }
};

/**
* Destroy cached image view data
* @public
*/
LightBoxManager.prototype.destroyLightBoxImageMap = function () {
    var self = this;
    self._lightBoxImageMap = {};
};

/**
* Destroy LightBoxManager
* @public
*/
LightBoxManager.prototype.destroy = function () {
    var self = this;
    self._selector.removeChild(self._whiteOverlay);
    self._selector.removeChild(self._blackOverlay);
    self._selector.removeChild(self._nextNav);
    self._selector.removeChild(self._prevNav);
    self._selector.removeChild(self._titleBar);
    self._selector = null;
    self._viewManager = null;
    self._document = null;
    self._whiteOverlay = null;
    self._blackOverlay = null;
    self._nextNav = null;
    self._prevNav = null;
    self._titleBar = null;
    self._lightBoxImageMap = null;
};

module.exports = LightBoxManager;

},{}],8:[function(require,module,exports){
/* globals document */
'use strict';
var LightBoxManager = require('./lightbox-manager');

/**
* View manager is in charge of building and rendering
* view in dom level
* @param {PhotoGalleryMediator} mediator
* @param {HTMLElement} selector
* @class
*/
function ViewManager (mediator, selector) {
    var self = this;

    self._document = window.document;
    self._mediator = mediator;
    self._imageViewData = [];
    self._imageDetailData = [];
    self._selector = selector;
    self._viewElement = null;
    self._fragment = null;
    self._loadingBar = self.createLoadingBar();
    self._warningDiv = self.createWarningDiv();
    self._selector.appendChild(self._loadingBar);
    self._selector.appendChild(self._warningDiv);
    self._lightboxManager = new LightBoxManager(selector, self);
}

/**
* Make loading bar
* @returns {HTMLElement} loadingBar
* @public
*/
ViewManager.prototype.createLoadingBar = function () {
    var self = this;
    if (self._loadingBar) {
        return;
    }
    var loadingBar = self._document.createElement('div');
    loadingBar.id = 'loading';
    return loadingBar;
};

/**
* Make loading bar
* @public
*/
ViewManager.prototype.createWarningDiv = function () {
    var self = this;
    if (self._warningDiv) {
        return;
    }
    var warningDiv = self._document.createElement('div');
    warningDiv.id = 'warning';

    return warningDiv;
};

/**
* Shows loading bar
* @public
*/
ViewManager.prototype.showLoadingBar = function () {
    var self = this;
    self._loadingBar.style.display = 'block';
    self._loadingBar.style.marginTop = window.scrollY;
};

/**
* Hides loading bar
* @public
*/
ViewManager.prototype.hideLoadingBar = function () {
    var self = this;
    self._loadingBar.style.display = 'none';
};

/**
* Create image view and render gallery
* @param {object} data - image data
* @param {number} startIndex - start index of the image data
* @public
*/
ViewManager.prototype.append = function (data, startIndex) {
    var self = this;
    if (!data && !data.length) {
        return;
    }
    var newData = data.slice(startIndex);
    for (var i = 0; i < newData.length; i++) {
        if (!newData[i].imageSrc || !newData[i].imageSrc.length) {
            continue;
        }
        var linkNode = self._document.createElement('a');
        linkNode.href = newData[i].imageSrc;
        linkNode.onclick = self.createDetailImage.bind(self, linkNode);
        var img = self._document.createElement('img');
        img.src = newData[i].thumbSrc;
        img.alt = newData[i].title;
        img.className = 'thumbnail';
        img.setAttribute('data-index', i + startIndex);
        linkNode.appendChild(img);
        self._imageViewData.push(linkNode);
    }
    self.renderGallery(startIndex);
};

/**
* Creates detailed image view
* @public
*/
ViewManager.prototype.createDetailImage = function () {
    var self = this;

    var args = Array.prototype.slice.call(arguments);
    var linkNode = args[0];
    var event = args[1];

    event.preventDefault();
    event.stopPropagation();

    if (!linkNode.href || !linkNode.href.length) {
        return;
    }
    // render the view in lightbox
    self._lightboxManager.render(linkNode);
};

/**
* Creates view element that will contain gallery of photos
* @public
*/
ViewManager.prototype.createViewElement = function () {
    var self = this;
    var divNode = self._document.createElement('div');
    divNode.className = 'gallery';
    self._viewElement = divNode;
    self._selector.appendChild(divNode);
};

/**
* Destroy gallery of photos and lightbox cached photos
* @public
*/
ViewManager.prototype.clearImageView = function () {
    var self = this;
    if (self._viewElement) {
        // remove all the children
        while (self._viewElement.firstChild) {
            self._viewElement.removeChild(self._viewElement.firstChild);
        }
        self._viewElement = null;
        self._imageViewData = [];
        self._lightboxManager.destroyLightBoxImageMap();
    }
};

/**
* Render gallery of photos
* @public
*/
ViewManager.prototype.renderGallery = function (startIndex) {
    var self = this;
    if (!self._viewElement) {
        self.createViewElement();
    }
    self._fragment = self._document.createDocumentFragment();
    for (var i = startIndex; i < self._imageViewData.length; i++) {
        self._fragment.appendChild(self._imageViewData[i]);
    }
    self._viewElement.appendChild(self._fragment);
};

/**
* Show warning message for a period of time
* @param {string} description - description of the warning
* @param {duration} duration - duration of the warning in sec
* @private
*/
ViewManager.prototype.showWarning = function (description, sec) {
    var self = this;
    self._warningDiv.innerHTML = description;
    self._warningDiv.style.display = 'block';
    self._warningDiv.style.marginTop = window.scrollY;
    var callback = function () {
        self._hideWarning();
    };
    setTimeout(callback, sec * 1000);
};

/**
* Hide warning message
* @private
*/
ViewManager.prototype._hideWarning = function () {
    var self = this;
    self._warningDiv.style.display = 'none';
};

/**
* Destroy View Manager
* @private
*/
ViewManager.prototype.destroy = function () {
    var self = this;
    self._selector.removeChild(self._loadingBar);
    self._selector.removeChild(self._warningDiv);
    if (self._viewElement) {
        self._selector.removeChild(self._viewElement);
    }
    self.clearImageView();
    self._lightboxManager.destroy();
    self._document = null;
    self._mediator = null;
    self._imageViewData = null;
    self._imageDetailData = null;
    self._selector = null;
    self._viewElement = null;
    self._loadingBar = null;
    self._warningDiv = null;
    self._lightboxManager = null;
    self._fragment = null;
};

module.exports = ViewManager;

},{"./lightbox-manager":7}],"photogallery":[function(require,module,exports){
/* globals window */
/* globals document */
'use strict';

var PhotoGalleryMediator = require('./photo-gallery-mediator');

/**
* Photo Gallery that has ability to search photos using defined api
* and renders endless scroll of photos on the page
* @param {HTMLElement} selector
* @public
* @class
*/
function PhotoGallery (selector) {
    var self = this;
    self._mediator = new PhotoGalleryMediator(self, selector);
    self._currentKeyword = null;
    self._lastScrollingToEndTimestamp = null;
    window.onscroll = self.nextPage.bind(self);
}

/**
* Search photo by the provided keyword
* @param {string} keyword
* @public
*/
PhotoGallery.prototype.search = function (keyword) {
    var self = this;
    // new search
    if (keyword !== self._currentKeyword) {
        self._mediator.clear();
    }
    if (keyword && keyword.length > 0) {
        self._mediator.search(keyword);
        self._currentKeyword = keyword;
    }
};

/**
* Fetch next page of photos from the image api
* @public
*/
PhotoGallery.prototype.nextPage = function () {
    var self = this;
    if (self._lastScrollingToEndTimestamp &&
        Date.now() - self._lastScrollingToEndTimestamp < 1500) {
        return;
    }
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        self.search(self._currentKeyword);
        self._lastScrollingToEndTimestamp = Date.now();
    }
};

/**
* Destroy photo gallery instance
* @public
*/
PhotoGallery.prototype.destroy = function () {
    var self = this;
    if (self._mediator) {
        self._mediator.destroy();
    }
    self._mediator = null;
};

module.exports = PhotoGallery;

},{"./photo-gallery-mediator":3}]},{},[]);
