/* globals window */
/* globals document */
'use strict';

var PhotoGalleryContext = require('./photo-gallery-context');

function PhotoGallery (selector) {
    var self = this;
    self._context = new PhotoGalleryContext(self, selector);
    self._currentKeyword = null;
    self._lastScrollingToEndTimestamp = null;
    window.onscroll = self.nextPage.bind(self);
}

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
    if (self._lastScrollingToEndTimestamp &&
        Date.now() - self._lastScrollingToEndTimestamp < 1500) {
        return;
    }
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        self.search(self._currentKeyword);
        self._lastScrollingToEndTimestamp = Date.now();
    }
};

// PhotoGallery.prototype.loadDetail = function (event) {
//     var self = this;
//     event.preventDefault();
//     event.stopPropagation();
//     if (!self.href || !self.href.length) {
//         return;
//     }
//     self._context.loadDetail(self.href);
//     console.log('loading detail url is ' + self.href);
// };

module.exports = PhotoGallery;