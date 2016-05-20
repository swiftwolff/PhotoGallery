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
        Date.now() - self._lastScrollingToEndTimestamp < 3000) {
        return;
    }
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 300) {
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
