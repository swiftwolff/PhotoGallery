'use strict';

var APIManager = require('./service/api-manager');
var LoadManager = require('./service/load-manager');
var DataManager = require('./model/data-manager');
var ViewManager = require('./view/view-manager');

function PhotoGalleryContext (photogallery, selector) {
    var self = this;
    self._photogallery = photogallery;
    self._apiManager = new APIManager(self);
    self._dataManager = new DataManager(self);
    self._viewManager = new ViewManager(self, selector);
    self._loadManager = new LoadManager(self);
}

PhotoGalleryContext.prototype.search = function (keyword) {
    var self = this;
    self._apiManager.search(keyword);
};

PhotoGalleryContext.prototype.loadDetail = function (url) {
    var self = this;
    self._loadManager.loadDetail(url);
};

PhotoGalleryContext.prototype.clear = function () {
    var self = this;
    self._dataManager.clearImageData();
    self._viewManager.clearImageView();
};

module.exports = PhotoGalleryContext;