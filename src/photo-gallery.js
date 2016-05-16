/* globals window */
/* globals document */
'use strict';

var PhotoGalleryContext = require('./photo-gallery-context');

function PhotoGallery (selector) {
    var self = this;
    self._context = new PhotoGalleryContext(selector);
    self._currentKeyword = null;
    window.onscroll = self.nextPage.bind(self);
}

PhotoGallery.prototype.mount = function () {
    console.log('mounting!');
};

PhotoGallery.prototype.destroy = function () {
    console.log('destroying!');
};

PhotoGallery.prototype.autoplayStart = function () {
    console.log('autoplayStarting!');
};

PhotoGallery.prototype.autoplayStop = function () {
    console.log('autoplayStopping!!!');
};

PhotoGallery.prototype.search = function (keyword) {
    var self = this;
    if (keyword !== self._currentKeyword) {
        self._context.clear();
    }
    if (keyword && keyword.length > 0) {
        self._context.search(keyword);
        self._currentKeyword = keyword;
    }
};

PhotoGallery.prototype.nextPage = function () {
    var self = this;
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        self.search(self._currentKeyword);
    }
};

module.exports = PhotoGallery;