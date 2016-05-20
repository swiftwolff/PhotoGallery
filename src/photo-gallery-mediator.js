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
