'use strict';

var PhotoGalleryContext = require('./photo-gallery-context');

function PhotoGallery (selector) {
    var self = this;
    self._context = new PhotoGalleryContext(selector);
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
    self._context.search(keyword);
};

module.exports = PhotoGallery;