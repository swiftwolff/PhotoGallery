'use strict';

require('./globals');

function MockHTMLElement () {
    var self = this;
    self.appendChild = function (elem) {};
    self.setAttribute = function () {};
    self.removeChild = function () {};
}

function MockLightBoxManager () {
    var self = this;
    self._selector = new MockHTMLElement();
    self.init = function () {};
}

function MockPhotoGalleryMediator () {
    var self = this;
}

module.exports.MockHTMLElement = MockHTMLElement;
module.exports.MockLightBoxManager = MockLightBoxManager;
module.exports.MockPhotoGalleryMediator = MockPhotoGalleryMediator;